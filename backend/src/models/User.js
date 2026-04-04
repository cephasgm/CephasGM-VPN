const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async create(email, password) {
    const hash = await bcrypt.hash(password, 10);
    const res = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hash]
    );
    return res.rows[0];
  }

  static async findByEmail(email) {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
  }

  static async comparePassword(plain, hash) {
    return bcrypt.compare(plain, hash);
  }
}

module.exports = User;
