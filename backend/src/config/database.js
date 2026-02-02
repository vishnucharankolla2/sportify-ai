const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  logger.info('Database connected');
});

const query = (text, params) => {
  const start = Date.now();
  return pool.query(text, params).then(res => {
    const duration = Date.now() - start;
    logger.debug(`Executed query in ${duration}ms`);
    return res;
  }).catch(err => {
    logger.error(`Database query error: ${err.message}`);
    throw err;
  });
};

module.exports = {
  query,
  pool
};
