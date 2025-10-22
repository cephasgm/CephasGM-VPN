const express = require('express');
const router = express.Router();

// Get usage statistics
router.get('/usage', async (req, res) => {
  try {
    const stats = {
      totalClients: 46,
      activeConnections: 23,
      totalDataTransferred: '1.2 TB',
      serverLoad: {
        'eu-server': 45,
        'us-server': 67,
        'tz-server': 22
      },
      topCountries: [
        { country: 'Germany', users: 15 },
        { country: 'USA', users: 12 },
        { country: 'Tanzania', users: 8 },
        { country: 'UK', users: 6 },
        { country: 'France', users: 5 }
      ]
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get server health
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        vpn: 'running',
        api: 'healthy',
        dashboard: 'running'
      },
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;