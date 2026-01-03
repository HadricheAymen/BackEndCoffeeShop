const mysql = require('mysql2/promise');
require('dotenv').config();

// Determine if running in serverless environment (Vercel)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

// Create connection pool with serverless-optimized settings
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'coffee_shop_db',
  waitForConnections: true,
  // Serverless environments need smaller connection pools
  connectionLimit: isServerless ? 1 : 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Add connection timeout for serverless
  connectTimeout: 10000,
  // Enable SSL for cloud databases
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: true
  } : undefined
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end();
    console.log('Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  closePool
};

