const { Stock } = require('../models');

const getAllStocks = async () => {
  return Stock.findAll();
};

const getStockByTicker = async (ticker) => {
  return Stock.findOne({ where: { ticker } });
};

const createStock = async (stockData) => {
  return Stock.create(stockData);
};

module.exports = {
  getAllStocks,
  getStockByTicker,
  createStock
};