// db-run-schema.js
const fs = require('fs');
const mysql = require('mysql2/promise');
const sql = fs.readFileSync('database/schema.sql', 'utf8');

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true // only for setup scripts
  });
  await conn.query(sql);
  await conn.end();
}
run().catch(e => console.error(e));