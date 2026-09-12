import apiClient from './apiClient';

export const adminApi = {
  // Authentication
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  getMe: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),

  // Stats
  getStats: () => apiClient.get('/admin/stats'),

  // Services
  getServices: () => apiClient.get('/admin/services'),
  createService: (data) => apiClient.post('/admin/services', data),
  updateService: (id, data) => apiClient.put(`/admin/services/${id}`, data),
  deleteService: (id) => apiClient.delete(`/admin/services/${id}`),

  // Event Requests
  getEventRequests: () => apiClient.get('/admin/event-requests'),
  updateEventRequestStatus: (id, status) => apiClient.patch(`/admin/event-requests/${id}/status`, { status }),

  // Quotes
  getQuotes: () => apiClient.get('/admin/quotes'),
  updateQuote: (id, data) => apiClient.put(`/admin/quotes/${id}`, data),

  // Bookings
  getBookings: () => apiClient.get('/admin/bookings'),
  updateBookingStatus: (id, bookingStatus, paymentStatus) => 
    apiClient.patch(`/admin/bookings/${id}/status`, { bookingStatus, paymentStatus }),

  // Payments
  getPayments: () => apiClient.get('/admin/payments'),

  // Payment Assistance
  getPaymentAssistance: () => apiClient.get('/admin/payment-assistance'),
  updatePaymentAssistanceStatus: (id, status) => 
    apiClient.patch(`/admin/payment-assistance/${id}/status`, { status }),

  // Contact Messages
  getContactMessages: () => apiClient.get('/admin/contact-messages'),
  toggleMessageRead: (id, isRead) => 
    apiClient.patch(`/admin/contact-messages/${id}/read`, { isRead }),
};
