import apiClient from './apiClient';

export const contactApi = {
  send: (data) => apiClient.post('/contact', data),
};
