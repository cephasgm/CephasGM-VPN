// backend/src/models/Server.js

const { pool } = require('../config/db');

class Server {
  /**
   * Get all servers
   * @returns {Promise<Array>} List of server objects
   */
  static async findAll() {
    const query = `
      SELECT id, name, endpoint, public_key, allowed_ips, created_at
      FROM servers
      ORDER BY id ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Find a server by its ID
   * @param {number} id - Server ID
   * @returns {Promise<Object|null>} Server object or null
   */
  static async findById(id) {
    const query = `
      SELECT id, name, endpoint, public_key, allowed_ips, created_at
      FROM servers
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find a server by name
   * @param {string} name - Server name
   * @returns {Promise<Object|null>} Server object or null
   */
  static async findByName(name) {
    const query = `
      SELECT id, name, endpoint, public_key, allowed_ips, created_at
      FROM servers
      WHERE name = $1
    `;
    const result = await pool.query(query, [name]);
    return result.rows[0] || null;
  }

  /**
   * Create a new server entry
   * @param {Object} serverData - { name, endpoint, public_key, allowed_ips }
   * @returns {Promise<Object>} Created server
   */
  static async create({ name, endpoint, public_key, allowed_ips = '0.0.0.0/0' }) {
    const query = `
      INSERT INTO servers (name, endpoint, public_key, allowed_ips)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, endpoint, public_key, allowed_ips, created_at
    `;
    const values = [name, endpoint, public_key, allowed_ips];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Update a server
   * @param {number} id - Server ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object|null>} Updated server or null
   */
  static async update(id, updates) {
    const allowedFields = ['name', 'endpoint', 'public_key', 'allowed_ips'];
    const setClauses = [];
    const values = [];
    let idx = 1;

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        setClauses.push(`${field} = $${idx}`);
        values.push(updates[field]);
        idx++;
      }
    }

    if (setClauses.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE servers
      SET ${setClauses.join(', ')}
      WHERE id = $${idx}
      RETURNING id, name, endpoint, public_key, allowed_ips, created_at
    `;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Delete a server
   * @param {number} id - Server ID
   * @returns {Promise<boolean>} True if deleted
   */
  static async delete(id) {
    const query = 'DELETE FROM servers WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }
}

module.exports = Server;
