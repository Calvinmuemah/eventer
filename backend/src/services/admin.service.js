import { adminRepository } from '../repositories/admin.repository.js';
import { badRequest, notFound } from '../utils/apiError.js';

export const adminService = {
  async getDashboardStats() {
    return await adminRepository.getDashboardStats();
  },

  // Services
  async getAllServices() {
    return await adminRepository.getAllServices();
  },

  async createService(data) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      throw badRequest('Service name is required (at least 2 characters).');
    }
    const slug = data.slug 
      ? data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const short_description = data.short_description || data.description?.slice(0, 140) || 'Premium event service.';
    const description = data.description || short_description;
    const image_url = data.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80';

    return await adminRepository.createService({
      name: data.name.trim(),
      slug,
      short_description: short_description.trim(),
      description: description.trim(),
      image_url: image_url.trim(),
      features: Array.isArray(data.features) ? data.features : [],
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
      sort_order: parseInt(data.sort_order, 10) || 0,
    });
  },

  async updateService(id, data) {
    let slug = undefined;
    if (data.slug || data.name) {
      const src = data.slug || data.name;
      slug = src.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const updated = await adminRepository.updateService(id, {
      ...data,
      slug: slug || undefined,
    });
    if (!updated) throw notFound(`Service with ID '${id}' was not found.`);
    return updated;
  },

  async deleteService(id) {
    const deleted = await adminRepository.deleteService(id);
    if (!deleted) throw notFound(`Service with ID '${id}' was not found.`);
    return deleted;
  },

  // Event Requests
  async getAllEventRequests() {
    return await adminRepository.getAllEventRequests();
  },

  async updateEventRequestStatus(id, status) {
    const valid = ['submitted', 'under_review', 'quoted', 'cancelled'];
    if (!valid.includes(status)) {
      throw badRequest(`Invalid status. Must be one of: ${valid.join(', ')}`);
    }
    const updated = await adminRepository.updateEventRequestStatus(id, status);
    if (!updated) throw notFound(`Event request with ID '${id}' was not found.`);
    return updated;
  },

  // Quotes
  async getAllQuotes() {
    return await adminRepository.getAllQuotes();
  },

  async updateQuote(id, data) {
    const updated = await adminRepository.updateQuote(id, data);
    if (!updated) throw notFound(`Quote with ID '${id}' was not found.`);
    return updated;
  },

  // Bookings
  async getAllBookings() {
    return await adminRepository.getAllBookings();
  },

  async updateBookingStatus(id, { bookingStatus, paymentStatus }) {
    const updated = await adminRepository.updateBookingStatus(id, bookingStatus, paymentStatus);
    if (!updated) throw notFound(`Booking with ID '${id}' was not found.`);
    return updated;
  },

  // Payments
  async getAllPayments() {
    return await adminRepository.getAllPayments();
  },

  // Payment Assistance
  async getAllPaymentAssistance() {
    return await adminRepository.getAllPaymentAssistance();
  },

  async updatePaymentAssistanceStatus(id, status) {
    const valid = ['Pending', 'Contacted', 'Resolved'];
    if (!valid.includes(status)) {
      throw badRequest(`Invalid status. Must be one of: ${valid.join(', ')}`);
    }
    const updated = await adminRepository.updatePaymentAssistanceStatus(id, status);
    if (!updated) throw notFound(`Assistance request with ID '${id}' was not found.`);
    return updated;
  },

  // Contact Messages
  async getAllContactMessages() {
    return await adminRepository.getAllContactMessages();
  },

  async toggleContactMessageRead(id, isRead) {
    const updated = await adminRepository.toggleContactMessageRead(id, Boolean(isRead));
    if (!updated) throw notFound(`Message with ID '${id}' was not found.`);
    return updated;
  }
};
