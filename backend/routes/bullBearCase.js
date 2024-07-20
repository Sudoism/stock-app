const express = require('express');
const router = express.Router();
const bullBearCaseService = require('../services/bullBearCaseService');

router.get('/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const bullBearCase = await bullBearCaseService.getBullBearCase(ticker);
    if (bullBearCase) {
      res.json(bullBearCase);
    } else {
      res.status(404).json({ error: 'Bull/Bear case not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;