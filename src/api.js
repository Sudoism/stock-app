import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Function to get cached data
const getCachedData = (key) => {
  const cachedItem = localStorage.getItem(key);
  if (cachedItem) {
    const { timestamp, data } = JSON.parse(cachedItem);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  return null;
};

// Function to set cached data
const setCachedData = (key, data) => {
  const item = {
    timestamp: Date.now(),
    data: data
  };
  localStorage.setItem(key, JSON.stringify(item));
};

// Wrapper for GET requests with caching
const cachedGet = async (url) => {
  const cachedData = getCachedData(url);
  if (cachedData) {
    return { data: cachedData };
  }
  const response = await axios.get(url);
  setCachedData(url, response.data);
  return response;
};

export const getStocksWithDetails = () => axios.get(`${API_URL}/stocks/with-details`);
export const getStocks = () => axios.get(`${API_URL}/stocks`);
export const getStock = (ticker) => axios.get(`${API_URL}/stocks/${ticker}`);
export const createStock = (data) => axios.post(`${API_URL}/stocks`, data);

export const getNotes = (ticker) => cachedGet(`${API_URL}/notes/${ticker}`);
export const createNote = (data) => axios.post(`${API_URL}/notes`, data);

export const getCase = (ticker) => axios.get(`${API_URL}/cases/${ticker}`);
export const createOrUpdateCase = (ticker, content) => axios.post(`${API_URL}/cases/${ticker}`, { content });

export const getFinancialRatios = (ticker) => cachedGet(`${API_URL}/financial-ratios/${ticker}`);
export const getNewsSentiment = (ticker) => cachedGet(`${API_URL}/news-sentiment/${ticker}`);

export const updateNote = (data) => axios.put(`${API_URL}/notes/${data.id}`, data);

export const deleteNote = (id) => axios.delete(`${API_URL}/notes/${id}`);

export const getBullBearCase = (ticker) => cachedGet(`${API_URL}/bull-bear-case/${ticker}`);

export const getStockInfo = (ticker) => cachedGet(`${API_URL}/stock-details?symbol=${ticker}`)