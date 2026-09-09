import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred while communicating with the server.';
    const details = error.response?.data?.error || null;
    return Promise.reject({ message, details, status: error.response?.status });
  }
);

export default apiClient;
