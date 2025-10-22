const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Serve static files
app.use(express.static('public'));

// API proxy to VPN API
app.use('/api', (req, res) => {
  // In production, this would proxy requests to the actual API
  res.json({ 
    message: 'Dashboard API proxy - would connect to VPN API',
    note: 'This is a placeholder. In real implementation, this would proxy to the main API server.'
  });
});

// Serve dashboard
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CephasGM VPN Dashboard</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .dashboard-container {
                background: white;
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                text-align: center;
                max-width: 500px;
                width: 90%;
            }
            .logo { 
                font-size: 2rem; 
                font-weight: bold; 
                color: #333;
                margin-bottom: 1rem;
            }
            .status { 
                background: #4CAF50; 
                color: white; 
                padding: 0.5rem 1rem; 
                border-radius: 20px; 
                display: inline-block;
                margin: 1rem 0;
            }
            .info-box {
                background: #f5f5f5;
                padding: 1rem;
                border-radius: 5px;
                margin: 1rem 0;
                text-align: left;
            }
            .endpoints {
                text-align: left;
                margin-top: 1rem;
            }
            .endpoint {
                background: #e3f2fd;
                padding: 0.5rem;
                margin: 0.5rem 0;
                border-radius: 5px;
                font-family: monospace;
            }
        </style>
    </head>
    <body>
        <div class="dashboard-container">
            <div class="logo">🌐 CephasGM VPN</div>
            <div class="status">Dashboard Running</div>
            
            <div class="info-box">
                <strong>Welcome to CephasGM VPN Admin Dashboard</strong>
                <p>This is the main admin interface for managing your VPN servers and clients.</p>
            </div>

            <div class="endpoints">
                <strong>Available Endpoints:</strong>
                <div class="endpoint">/api/servers - Server management</div>
                <div class="endpoint">/api/clients - Client management</div>
                <div class="endpoint">/api/analytics - Usage statistics</div>
            </div>

            <div style="margin-top: 1rem; color: #666; font-size: 0.9rem;">
                Server: ${process.env.API_URL || 'http://vpn-api:3000'}
            </div>
        </div>
    </body>
    </html>
  `);
});

const PORT = process.env.DASHBOARD_PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ CephasGM VPN Dashboard running on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
});