const express = require('express');
const router = express.Router();
const { Note, Stock } = require('../models');

// Get notes for a specific stock by ticker
router.get('/:ticker', async (req, res) => {
  const stock = await Stock.findOne({ where: { ticker: req.params.ticker } });
  if (stock) {
    const notes = await Note.findAll({ where: { stockId: stock.id } });
    res.json(notes);
  } else {
    res.status(404).json({ error: 'Stock not found' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { stockId, content, noteDate } = req.body;
    if (typeof content === 'object') {
      res.status(400).send({ error: 'Content must be a string.' });
      return;
    }
    const note = await Note.create({ stockId, content, noteDate });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    const { content, noteDate } = req.body;
    const updatedNote = await note.update({ content, noteDate });
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    await note.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
