const express = require('express');
const router = express.Router();

// Get all VPN servers
router.get('/', async (req, res) => {
  try {
    const servers = [
      {
        id: 'eu-server',
        name: 'Europe Server',
        location: 'Germany',
        status: 'online',
        clients: 15,
        load: 45,
        ip: '89.101.123.45'
      },
      {
        id: 'us-server', 
        name: 'USA Server',
        location: 'New York',
        status: 'online',
        clients: 23,
        load: 67,
        ip: '192.168.1.100'
      },
      {
        id: 'tz-server',
        name: 'Tanzania Server',
        location: 'Dar es Salaam',
        status: 'online',
        clients: 8,
        load: 22,
        ip: '41.222.156.78'
      }
    ];
    
    res.json({
      success: true,
      data: servers,
      count: servers.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get single server
router.get('/:id', async (req, res) => {
  try {
    const serverId = req.params.id;
    // In real app, fetch from database
    const server = {
      id: serverId,
      name: `${serverId} Server`,
      status: 'online',
      clients: Math.floor(Math.random() * 50) + 1,
      load: Math.floor(Math.random() * 100) + 1
    };
    
    res.json({
      success: true,
      data: server
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Add new server
router.post('/', async (req, res) => {
  try {
    const { name, location, ip } = req.body;
    
    // In real app, save to database
    const newServer = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      location,
      ip,
      status: 'offline',
      clients: 0,
      load: 0,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      message: 'Server added successfully',
      data: newServer
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;