const pino = require('pino');
const { name } = require('./queues/clinicalDataQueue');

module.exports = pino({
    formatters: {
        level: (label) => {
          return { level: label.toUpperCase() };
        },
      },
});
