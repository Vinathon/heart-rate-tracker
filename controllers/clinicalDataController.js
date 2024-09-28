// controllers/controller.js
const dataProcessor = require('../helpers/helper');
const pool = require('../db/db');
const config = require('../config/config');

// Controller function to receive and process clinical data
const receiveClinicalData = async (req, res) => {
    try {
        const payload = req.body;

        // Process the clinical data asynchronously
        const processedData = await dataProcessor.processClinicalData(
            payload,
            config.intervalDurationMinutes
        );

        if (pool) {
            // Store the data asynchronously in the database
            await pool.query(
                'INSERT INTO clinical_data (patient_id, data) VALUES ($1, $2)',
                [payload.patient_id, processedData]
            );
        } else {
            console.warn('Database pool is not available. Skipping database insertion.');
            // Optionally, you can store data elsewhere or proceed without storing
        }

        // Return the processed response
        res.status(200).json(processedData);
    } catch (error) {
        console.error('Error processing clinical data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to retrieve the latest clinical data for a patient
const getClinicalData = async (req, res) => {
    const { patientId } = req.params;

    try {
        if (pool) {
            const result = await pool.query(
                'SELECT data FROM clinical_data WHERE patient_id = $1 ORDER BY created_at DESC LIMIT 1',
                [patientId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'No data found for this patient.' });
            }

            res.status(200).json(result.rows[0].data);
        } else {
            console.warn('Database pool is not available. Cannot retrieve data.');
            res.status(503).json({ error: 'Service Unavailable' });
        }
    } catch (error) {
        console.error('Error retrieving clinical data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    receiveClinicalData,
    getClinicalData,
};
