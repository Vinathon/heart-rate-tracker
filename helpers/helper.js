// helpers/helper.js
const clinicalDataQueue = require('../queues/clinicalDataQueue');

/**
 * Enqueues clinical data for processing.
 *
 * @param {Object} payload - The clinical data payload received from the API.
 * @returns {Promise<void>}
 */
const enqueueClinicalData = async (payload) => {
    await clinicalDataQueue.add(payload, {
        attempts: 3, // Number of retry attempts
        backoff: 5000, // Wait 5 seconds before retrying
    });
};

module.exports = {
    enqueueClinicalData,
};
