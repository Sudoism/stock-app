// routes/cases.js
const express = require('express');
const router = express.Router();
const caseService = require('../services/caseService');

router.get('/:ticker', async (req, res) => {
  try {
    const caseInstance = await caseService.getCaseByTicker(req.params.ticker);
    res.json(caseInstance);
  } catch (error) {
    if (error.message === 'Stock not found') {
      res.status(404).json({ message: 'Stock not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

router.post('/:ticker', async (req, res) => {
  try {
    const caseInstance = await caseService.createOrUpdateCase(req.params.ticker, req.body.content);
    res.json(caseInstance);
  } catch (error) {
    if (error.message === 'Stock not found') {
      res.status(404).json({ message: 'Stock not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router;