const express = require('express');
const router = express.Router();
const { Note } = require('../models');

router.get('/:stockId', async (req, res) => {
  const notes = await Note.findAll({ where: { stockId: req.params.stockId } });
  res.json(notes);
});

router.post('/', async (req, res) => {
  const note = await Note.create(req.body);
  res.json(note);
});

module.exports = router;