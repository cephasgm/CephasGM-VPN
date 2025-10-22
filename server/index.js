const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection
mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/cephasgm_vpn', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/clients', require('./routes/clients'));
app.use('/api/servers', require('./routes/servers'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'CephasGM VPN API'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to CephasGM VPN API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      clients: '/api/clients',
      servers: '/api/servers',
      analytics: '/api/analytics'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ CephasGM VPN API running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});