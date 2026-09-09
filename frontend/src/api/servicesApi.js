import apiClient from './apiClient';

export const servicesApi = {
  getAll: () => apiClient.get('/services'),
  getBySlug: (slug) => apiClient.get(`/services/${slug}`),
};
