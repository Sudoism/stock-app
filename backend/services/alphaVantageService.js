// services/alphaVantageService.js
const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 24 * 60 * 60 }); // 24 hours cache

const getNewsSentiment = async (ticker) => {
  const cacheKey = `news_sentiment_${ticker}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'NEWS_SENTIMENT',
        tickers: ticker,
        limit: 1000, // Request up to 1000 results
        apikey: process.env.ALPHA_VANTAGE_API_KEY
      }
    });

    const data = response.data;

    // Filter the feed to only include items with relevance score > 0.7 for the queried ticker
    if (data.feed && Array.isArray(data.feed)) {
      data.feed = data.feed.filter(item => {
        if (item.ticker_sentiment && Array.isArray(item.ticker_sentiment)) {
          const relevantTicker = item.ticker_sentiment.find(ts => ts.ticker === ticker);
          return relevantTicker && parseFloat(relevantTicker.relevance_score) > 0.7;
        }
        return false;
      });
    }

    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching news sentiment from Alpha Vantage:', error);
    throw error;
  }
};

module.exports = {
  getNewsSentiment
};