// config/config.js
require('dotenv').config();
const fs = require('fs');
module.exports = {
    port: process.env.PORT || 3000,
    intervalDurationMinutes: Number(process.env.INTERVAL_DURATION_MINUTES) || 15,
    payloadSizeLimit: process.env.PAYLOAD_SIZE_LIMIT || '5mb',
    db: {
        user: process.env.DB_USER ,
        password: process.env.DB_PASSWORD ,
        host: process.env.DB_HOST ,
        port: Number(process.env.DB_PORT) ,
        database: process.env.DB_NAME ,
        ssl: {
            rejectUnauthorized: true,
            ca: fs.readFileSync(process.env.DB_SSL_CERT_PATH).toString(),
        },
    }

};
