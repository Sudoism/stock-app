import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const getStocks = () => axios.get(`${API_URL}/stocks`);
export const getStock = (ticker) => axios.get(`${API_URL}/stocks/${ticker}`);
export const createStock = (data) => axios.post(`${API_URL}/stocks`, data);
export const getNotes = (ticker) => axios.get(`${API_URL}/notes/${ticker}`);
export const createNote = (data) => axios.post(`${API_URL}/notes`, data);
export const getStocksWithDetails = () => axios.get(`${API_URL}/stocks/with-details`);

export const updateNote = (data) => {
  return axios.put(`${API_URL}/notes/${data.id}`, data); 
};

export const deleteNote = (id) => {
  return axios.delete(`${API_URL}/notes/${id}`);
};
