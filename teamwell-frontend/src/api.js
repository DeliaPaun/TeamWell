import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

API.interceptors.request.use(
  config => {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      try {
        const { token } = JSON.parse(rawUser);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        }
      } catch (e) {
        console.error('api.js: nu am putut parsa user din localStorage', e);
      }
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => Promise.reject(err)
);

export default API;
