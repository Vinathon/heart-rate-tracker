// config/config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  intervalDurationMinutes: Number(process.env.INTERVAL_DURATION_MINUTES) || 15,
  payloadSizeLimit: process.env.PAYLOAD_SIZE_LIMIT || '5mb',
//   db: {
//     user: process.env.DB_USER ,
//     host: process.env.DB_HOST || 'localhost',
//     database: process.env.DB_NAME ,
//     password: process.env.DB_PASSWORD,
//     port: Number(process.env.DB_PORT) || 5432,
//   },
};
