require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const vpnRoutes = require('./routes/vpn');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

initDB().then(() => console.log('Database ready'));

app.use('/api/auth', authRoutes);
app.use('/api/vpn', vpnRoutes);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Backend running on port ${process.env.PORT}`);
});
