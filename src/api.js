import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

export const getStocks = () => api.get('/stocks');
export const createStock = (data) => api.post('/stocks', data);
export const getStock = (stockId) => api.get(`/stocks/${stockId}`); // Add this line
export const getNotes = (stockId) => api.get(`/notes/${stockId}`);
export const createNote = (data) => api.post('/notes', data);

export default api;
