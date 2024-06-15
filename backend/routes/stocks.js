const express = require('express');
const router = express.Router();
const { Stock } = require('../models');

// Get all stocks
router.get('/', async (req, res) => {
  const stocks = await Stock.findAll();
  res.json(stocks);
});

// Get a specific stock by ticker
router.get('/:ticker', async (req, res) => {
    console.log(`Fetching stock with ticker: ${req.params.ticker}`); // Ensure this logs correctly
    const stock = await Stock.findOne({ where: { ticker: req.params.ticker } });
    if (stock) {
      res.json(stock);
    } else {
      res.status(404).json({ error: 'Stock not found' });
    }
  });

// Create a new stock
router.post('/', async (req, res) => {
  const stock = await Stock.create(req.body);
  res.json(stock);
});

module.exports = router;
