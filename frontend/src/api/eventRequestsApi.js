import apiClient from './apiClient';

export const eventRequestsApi = {
  create: (data) => apiClient.post('/event-requests', data),
  getById: (id) => apiClient.get(`/event-requests/${id}`),
};
