// backend/src/routes/vpn.js
const express = require('express');
const auth = require('../middleware/auth');
const WireGuardService = require('../services/wireguard');
const Server = require('../models/Server');
const router = express.Router();

// All routes require authentication
router.use(auth);

/**
 * GET /api/vpn/servers
 * Returns list of available VPN servers
 */
router.get('/servers', async (req, res, next) => {
  try {
    const servers = await Server.findAll();
    // Return only public fields (exclude private keys, etc.)
    const publicServers = servers.map(s => ({
      id: s.id,
      name: s.name,
      endpoint: s.endpoint,
      allowed_ips: s.allowed_ips
    }));
    res.json(publicServers);
  } catch (err) {
    next(err); // Pass to errorHandler middleware
  }
});

/**
 * POST /api/vpn/config
 * Generates a WireGuard client configuration for the authenticated user
 * Body: { serverId: number }
 */
router.post('/config', async (req, res, next) => {
  const { serverId } = req.body;

  // Validate input
  if (!serverId || isNaN(parseInt(serverId))) {
    return res.status(400).json({ error: 'Valid serverId is required' });
  }

  try {
    // Check if server exists
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    // Generate WireGuard config
    const config = await WireGuardService.generateClientConfig(req.userId, serverId);
    
    // Return the config to client (download as .conf)
    res.json({
      config: config.config,
      clientIP: config.clientIP,
      clientPublicKey: config.clientPublicKey
    });
  } catch (err) {
    console.error('Config generation error:', err);
    next(err);
  }
});


// Xray config endpoint
router.get("/xray-config", async (req, res, next) => {
  try {
    const uuid = process.env.XRAY_UUID || "71226db2-b1b8-4d94-9791-623b5c0c7851";
    const link = `vless://${uuid}@vpn.cephasgm.com:8443?security=tls&flow=xtls-rprx-vision&encryption=none&sni=vpn.cephasgm.com#CephasGM-Xray`;
    res.json({ link });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// Xray config endpoint

// Add this middleware before the /config endpoint
const checkSubscription = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT subscription_status, subscription_end_date FROM users WHERE id = $1',
      [req.userId]
    );
    const user = result.rows[0];
    if (!user || user.subscription_status !== 'active') {
      return res.status(403).json({ error: 'Active subscription required' });
    }
    if (user.subscription_end_date && new Date(user.subscription_end_date) < new Date()) {
      return res.status(403).json({ error: 'Subscription expired' });
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Apply middleware to /config endpoint (uncomment the line below)
// router.post('/config', checkSubscription, async (req, res, next) => {

// Xray config endpoint (returns all protocols)
