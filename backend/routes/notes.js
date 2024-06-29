const express = require('express');
const router = express.Router();
const noteService = require('../services/noteService');

// Get notes for a specific stock by ticker
router.get('/:ticker', async (req, res) => {
  try {
    const notes = await noteService.getNotesByTicker(req.params.ticker);
    if (notes) {
      res.json(notes);
    } else {
      res.status(404).json({ error: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const { stockId, content, noteDate } = req.body;
    if (typeof content === 'object') {
      res.status(400).send({ error: 'Content must be a string.' });
      return;
    }
    const note = await noteService.createNote({ stockId, content, noteDate });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an existing note
router.put('/:id', async (req, res) => {
  try {
    const updatedNote = await noteService.updateNote(req.params.id, req.body);
    if (updatedNote) {
      res.json(updatedNote);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const result = await noteService.deleteNote(req.params.id);
    if (result) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;