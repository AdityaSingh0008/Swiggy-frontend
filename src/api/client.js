import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://swiggy-backend-syuv.onrender.com/api';

const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('sp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
