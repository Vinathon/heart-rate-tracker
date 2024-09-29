// queues/clinicalDataQueue.js
const Bull = require('bull');
const Redis = require('ioredis');
const config = require('../config/config');

// Redis configuration
const redisOptions = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
};

// Initialize Redis connection
const redisClient = new Redis(redisOptions);

// Create a Bull queue named 'clinical-data'
const clinicalDataQueue = new Bull('clinical-data', {
    redis: redisOptions,
});

module.exports = clinicalDataQueue;
