const { Stock, Note } = require('../models');

const getAllStocks = async () => {
  return Stock.findAll();
};

const getStockByTicker = async (ticker) => {
  return Stock.findOne({ where: { ticker } });
};

const createStock = async (stockData) => {
  return Stock.create(stockData);
};

const getStocksWithDetails = async () => {
  try {
    const stocks = await Stock.findAll({
      include: [{
        model: Note,
        attributes: ['noteDate', 'transactionType', 'quantity'],
      }],
      order: [['name', 'ASC']]
    });

    return stocks.map(stock => {
      const latestNote = stock.Notes.reduce((latest, note) => 
        (!latest || new Date(note.noteDate) > new Date(latest.noteDate)) ? note : latest
      , null);

      const sharesOwned = stock.Notes.reduce((total, note) => {
        if (note.transactionType === 'buy') {
          return total + note.quantity;
        } else if (note.transactionType === 'sell') {
          return total - note.quantity;
        }
        return total;
      }, 0);

      return {
        id: stock.id,
        name: stock.name,
        ticker: stock.ticker,
        latestNoteDate: latestNote ? latestNote.noteDate : null,
        sharesOwned: sharesOwned
      };
    });
  } catch (error) {
    console.error('Error in getStocksWithDetails:', error);
    throw error;
  }
};

module.exports = {
  getAllStocks,
  getStockByTicker,
  createStock,
  getStocksWithDetails
};