// db/db.js
const { Pool } = require('pg');
const config = require('../config/config');

let pool;

if (config.db && Object.keys(config.db).length > 0) {
    try {
        pool = new Pool(config.db);
    } catch (error) {
        console.error('Error initializing database pool:', error);
        pool = null; // Set pool to null if there's an error during initialization
    }
} else {
    console.warn('Database configuration is missing. Database connections will not be available.');
    pool = null; // Set pool to null when configuration is missing
}

module.exports = pool;
