const { Readable, Transform } = require('stream');

const processClinicalData = async (payload, intervalDuration) => {
  const clinicalData = payload.clinical_data;
  const heartRateData = clinicalData.HEART_RATE.data;

  if (heartRateData && heartRateData.length > 0) {
    // Create a readable stream from the heart rate data array
    const heartRateStream = Readable.from(heartRateData);

    // Transform stream to aggregate data
    const aggregatedData = await aggregateHeartRateDataStream(heartRateStream, intervalDuration);

    // Replace the original data with aggregated data
    clinicalData.HEART_RATE.data = aggregatedData;
  }

  // Return the modified payload
  return payload;
};

const aggregateHeartRateDataStream = (heartRateStream, intervalDurationMinutes) => {
  return new Promise((resolve, reject) => {
    const aggregatedData = [];
    let currentInterval = null;

    const transformStream = new Transform({
      objectMode: true,
      transform(reading, encoding, callback) {
        try {
          const readingTime = new Date(reading.on_date);

          if (!currentInterval) {
            // Start a new interval
            currentInterval = {
              from_date: reading.on_date,
              to_date: reading.on_date,
              measurement: {
                low: reading.measurement,
                high: reading.measurement,
              },
            };
          } else {
            const intervalStartTime = new Date(currentInterval.from_date);
            const timeDifference = (readingTime - intervalStartTime) / (1000 * 60); // Difference in minutes

            if (timeDifference <= intervalDurationMinutes) {
              // Update the current interval
              currentInterval.to_date = reading.on_date;
              currentInterval.measurement.low = Math.min(
                Number(currentInterval.measurement.low),
                Number(reading.measurement)
              ).toString();
              currentInterval.measurement.high = Math.max(
                Number(currentInterval.measurement.high),
                Number(reading.measurement)
              ).toString();
            } else {
              // Push the completed interval and start a new one
              aggregatedData.push(currentInterval);
              currentInterval = {
                from_date: reading.on_date,
                to_date: reading.on_date,
                measurement: {
                  low: reading.measurement,
                  high: reading.measurement,
                },
              };
            }
          }
          callback();
        } catch (error) {
          callback(error);
        }
      },
      flush(callback) {
        // Add the last interval
        if (currentInterval) {
          aggregatedData.push(currentInterval);
        }
        callback();
      },
    });

    heartRateStream.pipe(transformStream);

    transformStream.on('finish', () => {
      resolve(aggregatedData);
    });

    transformStream.on('error', (error) => {
      reject(error);
    });
  });
};

module.exports = {
  processClinicalData,
};
