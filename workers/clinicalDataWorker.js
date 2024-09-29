// workers/clinicalDataWorker.js

const config = require('../config/config');
const clinicalDataQueue = require('../queues/clinicalDataQueue');
const pool = require('../db/db');

/**
 * Aggregates Heart Rate data into 15-minute intervals.
 * @param {Array} heartRateData - Array of heart rate readings.
 * @param {number} intervalDuration - Duration of each interval in minutes.
 * @returns {Array} - Aggregated heart rate data.
 */
const aggregateHeartRateData = (heartRateData, intervalDuration) => {
  // Sort data by on_date
  heartRateData.sort((a, b) => new Date(a.on_date) - new Date(b.on_date));
  const aggregatedData = [];
  let currentInterval = null;

  heartRateData.forEach((reading) => {
    const readingTime = new Date(reading.on_date);
    const intervalStart = new Date(readingTime);
    intervalStart.setSeconds(0, 0);
    intervalStart.setMinutes(
      Math.floor(readingTime.getMinutes() / intervalDuration) * intervalDuration
    );

    const intervalEnd = new Date(intervalStart);
    intervalEnd.setMinutes(intervalEnd.getMinutes() + intervalDuration);

    if (
      !currentInterval ||
      readingTime >= new Date(currentInterval.to_date)
    ) {
      // Start a new interval
      currentInterval = {
        from_date: intervalStart.toISOString(),
        to_date: intervalEnd.toISOString(),
        measurement: {
          low: Number(reading.measurement),
          high: Number(reading.measurement),
        },
      };
      aggregatedData.push(currentInterval);
    } else {
      // Update existing interval
      const measurement = Number(reading.measurement);
      currentInterval.measurement.low = Math.min(currentInterval.measurement.low, measurement);
      currentInterval.measurement.high = Math.max(currentInterval.measurement.high, measurement);
    }
  });

  return aggregatedData;
};

/**
 * Processes a job from the queue: aggregates data and stores it in the DB.
 */
const processJob = async (job) => {
  const { requestId, payload } = job.data;
  const intervalDuration = config.intervalDurationMinutes; // 15 minutes

  const clinicalData = payload.clinical_data;
  const heartRateData = clinicalData.HEART_RATE.data;

  if (heartRateData && heartRateData.length > 0) {
    // Aggregate Heart Rate data
    const aggregatedHeartRate = aggregateHeartRateData(heartRateData, intervalDuration);

    // Replace the original data with aggregated data
    clinicalData.HEART_RATE.data = aggregatedHeartRate;
  }

  // Prepare data for insertion
  const dataToStore = {
    ...clinicalData,
  };

  try {
    // Insert aggregated data into PostgreSQL with requestId
    await pool.query(
      'INSERT INTO clinical_data_2 (request_id, patient_id, data) VALUES ($1, $2, $3)',
      [requestId, payload.patient_id, dataToStore]
    );

    console.log(`Job ${requestId} processed successfully.`);
  } catch (error) {
    console.error(`Error processing job ${requestId}:`, error);
    throw error; // Let Bull handle retries
  }
};

// Register the job processor
clinicalDataQueue.process(processJob);

// Event listeners for logging
clinicalDataQueue.on('completed', (job, result) => {
  console.log(`Job ${job.data.requestId} completed.`);
});

clinicalDataQueue.on('failed', (job, err) => {
  console.error(`Job ${job.data.requestId} failed:`, err);
});

console.log('Clinical Data Worker is running and listening to the queue...');
