const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');

// Get all stocks with details
router.get('/with-details', async (req, res) => {
  console.log("Reached")
  try {
    const stocks = await stockService.getStocksWithDetails();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all stocks
router.get('/', async (req, res) => {
  try {
    const stocks = await stockService.getAllStocks();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific stock by ticker
router.get('/:ticker', async (req, res) => {
  try {
    const stock = await stockService.getStockByTicker(req.params.ticker);
    if (stock) {
      res.json(stock);
    } else {
      res.status(404).json({ error: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new stock
router.post('/', async (req, res) => {
  try {
    const stock = await stockService.createStock(req.body);
    res.status(201).json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a stock
router.put('/:id', async (req, res) => {
  try {
    const updatedStock = await stockService.updateStock(req.params.id, req.body);
    if (updatedStock) {
      res.json(updatedStock);
    } else {
      res.status(404).json({ error: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a stock
router.delete('/:id', async (req, res) => {
  try {
    const result = await stockService.deleteStock(req.params.id);
    if (result) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;