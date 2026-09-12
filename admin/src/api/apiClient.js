import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://eventer-ef4v.vercel.app/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token to all outgoing admin requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mctitoe_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mctitoe_admin_token');
      localStorage.removeItem('mctitoe_admin_user');
      window.dispatchEvent(new Event('mctitoe_admin_unauthorized'));
    }
    const message = 
      error.response?.data?.message || 
      error.message || 
      'An unexpected error occurred in operations.';
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default apiClient;
