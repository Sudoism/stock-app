const express = require('express');
const router = express.Router();
const { Stock } = require('../models');

// Get all stocks
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.findAll();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new stock
router.post('/', async (req, res) => {
  try {
    const stock = await Stock.create(req.body);
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
