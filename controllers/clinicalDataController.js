// controllers/controller.js
const dataProcessor = require('../helpers/helper');
const pool = require('../db/db');
const config = require('../config/config');

const receiveClinicalData = async (req, res) => {
  try {
    const payload = req.body;

    // Process the clinical data asynchronously
    const processedData = await dataProcessor.processClinicalData(
      payload,
      config.intervalDurationMinutes
    );

    // Store the data asynchronously in the database
    await pool.query('INSERT INTO clinical_data(data) VALUES($1)', [processedData]);

    // Return the processed response
    res.status(200).json(processedData);
  } catch (error) {
    console.error('Error processing clinical data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  receiveClinicalData,
};
