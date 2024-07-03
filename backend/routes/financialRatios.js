const express = require('express');
const router = express.Router();
const financialApiService = require('../services/financialApiService');

router.get('/:symbol', async (req, res) => {
  try {
    const ratios = await financialApiService.getFinancialRatios(req.params.symbol);
    res.json(ratios);
  } catch (error) {
    console.error('Error fetching financial ratios:', error);
    res.status(500).json({ error: 'Error fetching financial ratios' });
  }
});

module.exports = router;