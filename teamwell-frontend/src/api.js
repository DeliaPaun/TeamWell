import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use(
  config => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        const { token } = JSON.parse(stored);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Nu am putut parsa user-ul din localStorage:', e);
      }
    }
    return config;
  },
  err => Promise.reject(err)
);

export default API;
