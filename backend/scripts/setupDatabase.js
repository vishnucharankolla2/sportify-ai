const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const logger = require('../src/utils/logger');

require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function setupDatabase() {
  try {
    logger.info('🔧 Setting up Sportify AI database...');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    await pool.query(schema);

    logger.info('✓ Database schema created successfully');
    logger.info('✓ All tables and indexes created');

    await pool.end();
    logger.info('✓ Database setup completed');
  } catch (error) {
    logger.error(`❌ Database setup failed: ${error.message}`);
    process.exit(1);
  }
}

setupDatabase();
