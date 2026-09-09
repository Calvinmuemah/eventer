import apiClient from './apiClient';

export const paymentsApi = {
  getDetails: (bookingId) => apiClient.get(`/payments/${bookingId}`),
  initiate: (bookingId, data) => apiClient.post(`/payments/${bookingId}/initiate`, data),
  requestAssistance: (data) => apiClient.post('/payment-assistance', data),
};
