import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'https://swiggy-backend-syuv.onrender.com/api';

if (API_URL && !API_URL.endsWith('/api') && !API_URL.endsWith('/api/')) {
  API_URL = API_URL.endsWith('/') ? `${API_URL}api` : `${API_URL}/api`;
}

const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('sp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('sp_token');
      // If we are not already on login, we could redirect here, 
      // but Context usually handles auth state better. At least clear token.
      window.dispatchEvent(new Event('auth-expired'));
    }
    return Promise.reject(error);
  }
);

export default client;
