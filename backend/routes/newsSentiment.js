// routes/newsSentiment.js
const express = require('express');
const router = express.Router();
const alphaVantageService = require('../services/alphaVantageService');

router.get('/:ticker', async (req, res) => {
  try {
    const data = await alphaVantageService.getNewsSentiment(req.params.ticker);
    res.json(data);
  } catch (error) {
    console.error('Error fetching news sentiment:', error);
    res.status(500).json({ error: 'Error fetching news sentiment' });
  }
});

module.exports = router;