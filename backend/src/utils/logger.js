const pino = require('pino');
const pretty = require('pino-pretty');

const stream = pretty({
  colorize: true,
  translateTime: 'SYS:standard',
  ignore: 'pid,hostname'
});

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime
  },
  stream
);

module.exports = logger;
