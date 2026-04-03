const express = require('express');
const auth = require('../middleware/auth');
const WireGuardService = require('../services/wireguard');
const { pool } = require('../config/db');
const router = express.Router();

router.use(auth);

router.get('/servers', async (req, res) => {
  const servers = await pool.query('SELECT id, name, endpoint FROM servers');
  res.json(servers.rows);
});

router.post('/config', async (req, res) => {
  const { serverId } = req.body;
  if (!serverId) return res.status(400).json({ error: 'serverId required' });
  
  try {
    const config = await WireGuardService.generateClientConfig(req.userId, serverId);
    // Optionally add peer to server (implement carefully)
    res.json({ config: config.config, clientIP: config.clientIP });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate config' });
  }
});

module.exports = router;
