const { pool } = require("../config/db");
const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    
    try {
      const user = await User.create(req.body.email, req.body.password);
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
      if (err.constraint === 'users_email_unique') 
        return res.status(409).json({ error: 'Email already exists' });
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const valid = await User.comparePassword(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  }
);

module.exports = router;

// Stripe checkout endpoint
router.post('/create-checkout', async (req, res) => {
  const { plan } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query('SELECT email FROM users WHERE id = $1', [decoded.userId]);
    const StripeService = require('../services/stripe');
    const session = await StripeService.createCheckoutSession(
      decoded.userId, 
      user.rows[0].email, 
      plan
    );
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check subscription status
router.get('/subscription-status', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      'SELECT subscription_status, subscription_plan, subscription_end_date FROM users WHERE id = $1',
      [decoded.userId]
    );
    res.json(result.rows[0] || { subscription_status: 'inactive' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stripe checkout endpoint
router.post('/create-checkout', async (req, res) => {
  const { plan } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query('SELECT email FROM users WHERE id = $1', [decoded.userId]);
    if (user.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const StripeService = require('../services/stripe');
    const session = await StripeService.createCheckoutSession(
      decoded.userId, 
      user.rows[0].email, 
      plan
    );
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Check subscription status
router.get('/subscription-status', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      'SELECT subscription_status, subscription_plan, subscription_end_date FROM users WHERE id = $1',
      [decoded.userId]
    );
    res.json(result.rows[0] || { subscription_status: 'inactive' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
