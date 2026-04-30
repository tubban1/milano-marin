const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function initDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  console.log('🚀 Connecting to database...');
  const schema = fs.readFileSync(path.join(__dirname, '../db/schema.sql'), 'utf8');
  
  try {
    await connection.query(schema);
    console.log('✅ Schema executed successfully');
  } catch (err) {
    console.error('❌ Error executing schema:', err.message);
  } finally {
    await connection.end();
  }
}

initDb();
