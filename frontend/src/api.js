import axios from 'axios';

/**
 * Centralized Axios instance for all API calls.
 * Base URL is read from the VITE_API_URL environment variable,
 * set in .env (local) or Vercel Dashboard (production).
 *
 * Usage:
 *   import api from '../api';
 *   const { data } = await api.get('/api/products');
 *   const { data } = await api.post('/api/auth/login', payload);
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://green-basket-theta.vercel.app',
});

export default api;
