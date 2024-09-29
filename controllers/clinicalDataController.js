// controllers/controller.js
const { v4: uuidv4 } = require('uuid');
const clinicalDataQueue = require('../queues/clinicalDataQueue');
const pool = require('../db/db');

/**
 * Receives clinical data, enqueues it for processing, and returns a unique ID.
 */
const receiveClinicalData = async (req, res) => {
  try {
    const payload = req.body;

    // Generate a unique ID for the request
    const requestId = uuidv4();

    // Add the job to the queue with the requestId
    await clinicalDataQueue.add({ requestId, payload }, {
      attempts: 3, // Retry up to 3 times on failure
      backoff: 5000, // Wait 5 seconds before retrying
    });

    // Respond with the requestId
    res.status(202).json({ requestId, message: 'Data is being processed.' });
  } catch (error) {
    console.error('Error enqueuing clinical data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Retrieves the aggregated clinical data based on the requestId.
 */
const getAggregatedData = async (req, res) => {
  const { requestId } = req.params;

  try {
    const result = await pool.query(
      'SELECT data FROM clinical_data_2 WHERE request_id = $1',
      [requestId]
    );

    if (result.rows.length === 0) {
      // Check if the job is still in the queue or being processed
      const waiting = await clinicalDataQueue.getWaiting();
      console.log('waiting: ', waiting);
      const active = await clinicalDataQueue.getActive();
      console.log('active: ', active);

      const isInQueue = waiting.some(job => job.data.requestId === requestId);
      const isActive = active.some(job => job.data.requestId === requestId);

      if (isInQueue || isActive) {
        return res.status(202).json({ status: 'Processing', message: 'Data is still being processed.' });
      }

      return res.status(404).json({ message: 'No data found for the provided requestId.' });
    }
    console.log(JSON.stringify(result.rows[0]))
    // Return the aggregated data
    res.status(200).json({ requestId, data: result.rows[0].data });
  } catch (error) {
    console.error('Error retrieving aggregated data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  receiveClinicalData,
  getAggregatedData,
};
