const { Stock, Note } = require('../models');
const financialApiService = require('./financialApiService');

const getAllStocks = async () => {
  return Stock.findAll();
};

const getStockByTicker = async (ticker) => {
  return Stock.findOne({ where: { ticker } });
};

const createStock = async (stockData) => {
  return Stock.create(stockData);
};

const updateStock = async (id, stockData) => {
  const stock = await Stock.findByPk(id);
  if (stock) {
    return stock.update(stockData);
  }
  return null;
};

const deleteStock = async (id) => {
  const stock = await Stock.findByPk(id);
  if (stock) {
    await stock.destroy();
    return true;
  }
  return false;
};

const getStocksWithDetails = async () => {
  try {
    const stocks = await Stock.findAll({
      include: [{
        model: Note,
        attributes: ['noteDate', 'transactionType', 'quantity', 'price'],
      }],
      order: [['name', 'ASC']]
    });

    const stocksWithDetails = await Promise.all(stocks.map(async (stock) => {
      const latestNote = stock.Notes.reduce((latest, note) => 
        (!latest || new Date(note.noteDate) > new Date(latest.noteDate)) ? note : latest
      , null);

      let sharesOwned = 0;
      let totalInvested = 0;
      let totalSold = 0;

      stock.Notes.forEach(note => {
        if (note.transactionType === 'buy') {
          sharesOwned += note.quantity;
          totalInvested += note.quantity * note.price;
        } else if (note.transactionType === 'sell') {
          sharesOwned -= note.quantity;
          totalSold += note.quantity * note.price;
        }
      });

      // Fetch current stock price using the new method
      let currentPrice;
      try {
        currentPrice = await financialApiService.getLatestStockPrice(stock.ticker);
      } catch (error) {
        console.error(`Error fetching price for ${stock.ticker}:`, error);
        currentPrice = null;
      }

      const currentValue = currentPrice ? sharesOwned * currentPrice : null;
      const totalValue = currentValue !== null ? currentValue + totalSold : null;
      const changeInValue = totalValue !== null ? totalValue - totalInvested : null;
      const changeInValuePercentage = (totalInvested !== 0 && changeInValue !== null) ? (changeInValue / totalInvested) * 100 : null;

      return {
        id: stock.id,
        name: stock.name,
        ticker: stock.ticker,
        latestNoteDate: latestNote ? latestNote.noteDate : null,
        sharesOwned: sharesOwned,
        changeInValue: changeInValue,
        changeInValuePercentage: changeInValuePercentage
      };
    }));

    return stocksWithDetails;
  } catch (error) {
    console.error('Error in getStocksWithDetails:', error);
    throw error;
  }
};

module.exports = {
  getAllStocks,
  getStockByTicker,
  createStock,
  getStocksWithDetails,
  updateStock,
  deleteStock
};