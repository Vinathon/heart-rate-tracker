
const express = require('express');
const app = express();
const config = require('./config/config');
const clinicalDataRoutes = require('./routes/routes');
const logger = require('./logger');
// set the payload size limit as required
app.use(express.json({ limit: config.payloadSizeLimit })); 

// Use routes


app.use('/v1/clinical-data', clinicalDataRoutes);
app.listen(config.port, () => {
  logger.info(`App listening on port ${config.port}`);
});

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught Exception');
  process.exit(1); // Optional: exit process after logging
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled Rejection');
  // Optional: handle accordingly
});