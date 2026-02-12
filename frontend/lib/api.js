import axios from 'axios';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api' });

api.interceptors.request.use(cfg => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
