const express = require('express');
const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = [
      {
        id: 'client-1',
        name: 'John\'s Laptop',
        server: 'eu-server',
        status: 'connected',
        ip: '10.8.0.2',
        connectedSince: '2024-01-15T08:30:00Z'
      },
      {
        id: 'client-2',
        name: 'Sarah\'s Phone',
        server: 'us-server',
        status: 'disconnected',
        ip: '10.8.0.3',
        connectedSince: null
      },
      {
        id: 'client-3',
        name: 'Office Desktop',
        server: 'tz-server',
        status: 'connected',
        ip: '10.8.0.4',
        connectedSince: '2024-01-15T09:15:00Z'
      }
    ];
    
    res.json({
      success: true,
      data: clients,
      count: clients.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Create new client
router.post('/', async (req, res) => {
  try {
    const { name, server } = req.body;
    
    // In real app, generate WireGuard config
    const newClient = {
      id: `client-${Date.now()}`,
      name,
      server,
      status: 'disconnected',
      ip: `10.8.0.${Math.floor(Math.random() * 250) + 2}`,
      config: `[Interface]
PrivateKey = client_private_key_here
Address = 10.8.0.${Math.floor(Math.random() * 250) + 2}/24
DNS = 1.1.1.1

[Peer]
PublicKey = server_public_key_here
Endpoint = ${server}.cephasgm.net:51820
AllowedIPs = 0.0.0.0/0`
    };
    
    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: newClient
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get client config
router.get('/:id/config', async (req, res) => {
  try {
    const clientId = req.params.id;
    
    // In real app, generate actual WireGuard config
    const config = `[Interface]
PrivateKey = client_private_key_${clientId}
Address = 10.8.0.${Math.floor(Math.random() * 250) + 2}/24
DNS = 1.1.1.1,1.0.0.1

[Peer]
PublicKey = server_public_key_here
Endpoint = eu-server.cephasgm.net:51820
AllowedIPs = 0.0.0.0/0`;
    
    res.set('Content-Type', 'text/plain');
    res.send(config);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;