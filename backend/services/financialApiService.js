const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 24 * 60 * 60 }); // 24 hours cache

const cachedAxiosGet = async (url, params) => {
  const cacheKey = `${url}?${new URLSearchParams(params).toString()}`;
  const cachedResponse = cache.get(cacheKey);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await axios.get(url, { params });
  cache.set(cacheKey, response.data);
  return response.data;
};

const getYahooStockData = async (symbol, period1, period2, interval) => {
  return cachedAxiosGet(`https://query1.finance.yahoo.com/v7/finance/download/${symbol}`, {
    period1,
    period2,
    interval,
    events: 'history',
    includeAdjustedClose: 'true'
  });
};

const getStockDetails = async (symbol) => {
  return cachedAxiosGet(`https://financialmodelingprep.com/api/v3/profile/${symbol}`, {
    apikey: process.env.FMP_API_KEY
  });
};

const getFinancialStatement = async (symbol) => {
  return cachedAxiosGet(`https://financialmodelingprep.com/api/v3/financial-statement-full-as-reported/${symbol}`, {
    period: 'annual',
    limit: 1,
    apikey: process.env.FMP_API_KEY
  });
};

module.exports = {
  getYahooStockData,
  getStockDetails,
  getFinancialStatement
};