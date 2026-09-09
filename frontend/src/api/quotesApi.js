import apiClient from './apiClient';

export const quotesApi = {
  getById: (id) => apiClient.get(`/quotes/${id}`),
  accept: (id) => apiClient.post(`/quotes/${id}/accept`),
  requestChanges: (id, notes) => apiClient.post(`/quotes/${id}/request-changes`, { notes }),
};
