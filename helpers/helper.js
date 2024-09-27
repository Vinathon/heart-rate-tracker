// helper/helper.js
const processClinicalData = async (payload, intervalDuration) => {
  const clinicalData = payload.clinical_data;
  const heartRateData = clinicalData.HEART_RATE.data;

  // Process HEART_RATE data
  if (heartRateData && heartRateData.length > 0) {
    // Sort the heart rate data by date
    heartRateData.sort((a, b) => new Date(a.on_date) - new Date(b.on_date));

    // Aggregate heart rate data into intervals asynchronously
    const aggregatedHeartRateData = await aggregateHeartRateData(heartRateData, intervalDuration);

    // Replace the original data with aggregated data
    clinicalData.HEART_RATE.data = aggregatedHeartRateData;
  }

  // Return the modified payload
  return payload;
};

const aggregateHeartRateData = (heartRateData, intervalDurationMinutes) => {
  return new Promise((resolve) => {
    const aggregatedData = [];
    let currentInterval = null;

    heartRateData.forEach((reading) => {
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
        const timeDifference = (readingTime - intervalStartTime) / (1000 * 60); // Difference in minutes from the start of the interval

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
    });

    // Add the last interval
    if (currentInterval) {
      aggregatedData.push(currentInterval);
    }

    resolve(aggregatedData);
  });
};


module.exports = {
  processClinicalData,
};
