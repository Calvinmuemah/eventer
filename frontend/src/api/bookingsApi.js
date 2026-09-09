import apiClient from './apiClient';

export const bookingsApi = {
  getById: (id) => apiClient.get(`/bookings/${id}`),
};
