import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Dodavanje tokena u header pre svakog zahteva
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Opcionalno: helper za manuelno setovanje tokena
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
