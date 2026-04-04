const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize tables
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS servers (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      endpoint TEXT NOT NULL,
      public_key TEXT NOT NULL,
      allowed_ips TEXT DEFAULT '0.0.0.0/0'
    );
    CREATE TABLE IF NOT EXISTS vpn_configs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      server_id INTEGER REFERENCES servers(id),
      client_private_key TEXT NOT NULL,
      client_public_key TEXT NOT NULL,
      assigned_ip TEXT NOT NULL,
      config_text TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

module.exports = { pool, initDB };
