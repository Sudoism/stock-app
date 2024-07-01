const { Note, Stock } = require('../models');

const getNotesByTicker = async (ticker) => {
  const stock = await Stock.findOne({ where: { ticker } });
  if (stock) {
    return Note.findAll({ 
      where: { stockId: stock.id },
      include: [{
        model: Stock,
        attributes: ['ticker']  // Include the ticker in the response
      }]
    });
  }
  return null;
};

const createNote = async (noteData) => {
  return Note.create(noteData);
};

const updateNote = async (id, noteData) => {
  const note = await Note.findByPk(id);
  if (note) {
    return note.update(noteData);
  }
  return null;
};

const deleteNote = async (id) => {
  const note = await Note.findByPk(id);
  if (note) {
    await note.destroy();
    return true;
  }
  return false;
};

module.exports = {
  getNotesByTicker,
  createNote,
  updateNote,
  deleteNote
};