import { adminService } from '../services/admin.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const adminController = {
  async getDashboardStats(req, res, next) {
    try {
      const data = await adminService.getDashboardStats();
      return sendSuccess(res, 'Dashboard metrics retrieved', data);
    } catch (err) {
      next(err);
    }
  },

  // Services
  async getAllServices(req, res, next) {
    try {
      const services = await adminService.getAllServices();
      return sendSuccess(res, 'All services retrieved for administration', services);
    } catch (err) {
      next(err);
    }
  },

  async createService(req, res, next) {
    try {
      const created = await adminService.createService(req.body);
      return sendSuccess(res, 'Service created successfully', created, 201);
    } catch (err) {
      next(err);
    }
  },

  async updateService(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await adminService.updateService(id, req.body);
      return sendSuccess(res, 'Service updated successfully', updated);
    } catch (err) {
      next(err);
    }
  },

  async deleteService(req, res, next) {
    try {
      const { id } = req.params;
      const result = await adminService.deleteService(id);
      return sendSuccess(res, 'Service removed / deactivated successfully', result);
    } catch (err) {
      next(err);
    }
  },

  // Event Requests
  async getAllEventRequests(req, res, next) {
    try {
      const requests = await adminService.getAllEventRequests();
      return sendSuccess(res, 'Event requests retrieved', requests);
    } catch (err) {
      next(err);
    }
  },

  async updateEventRequestStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await adminService.updateEventRequestStatus(id, status);
      return sendSuccess(res, 'Event request status updated', updated);
    } catch (err) {
      next(err);
    }
  },

  // Quotes
  async getAllQuotes(req, res, next) {
    try {
      const quotes = await adminService.getAllQuotes();
      return sendSuccess(res, 'Quotations retrieved', quotes);
    } catch (err) {
      next(err);
    }
  },

  async updateQuote(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await adminService.updateQuote(id, req.body);
      return sendSuccess(res, 'Quotation updated', updated);
    } catch (err) {
      next(err);
    }
  },

  // Bookings
  async getAllBookings(req, res, next) {
    try {
      const bookings = await adminService.getAllBookings();
      return sendSuccess(res, 'Bookings retrieved', bookings);
    } catch (err) {
      next(err);
    }
  },

  async updateBookingStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { bookingStatus, paymentStatus } = req.body;
      const updated = await adminService.updateBookingStatus(id, { bookingStatus, paymentStatus });
      return sendSuccess(res, 'Booking status updated', updated);
    } catch (err) {
      next(err);
    }
  },

  // Payments
  async getAllPayments(req, res, next) {
    try {
      const payments = await adminService.getAllPayments();
      return sendSuccess(res, 'Payments ledger retrieved', payments);
    } catch (err) {
      next(err);
    }
  },

  // Payment Assistance
  async getAllPaymentAssistance(req, res, next) {
    try {
      const list = await adminService.getAllPaymentAssistance();
      return sendSuccess(res, 'Payment assistance inquiries retrieved', list);
    } catch (err) {
      next(err);
    }
  },

  async updatePaymentAssistanceStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await adminService.updatePaymentAssistanceStatus(id, status);
      return sendSuccess(res, 'Assistance inquiry status updated', updated);
    } catch (err) {
      next(err);
    }
  },

  // Contact Messages
  async getAllContactMessages(req, res, next) {
    try {
      const messages = await adminService.getAllContactMessages();
      return sendSuccess(res, 'Contact inquiries retrieved', messages);
    } catch (err) {
      next(err);
    }
  },

  async toggleContactMessageRead(req, res, next) {
    try {
      const { id } = req.params;
      const { isRead } = req.body;
      const updated = await adminService.toggleContactMessageRead(id, isRead);
      return sendSuccess(res, 'Message status updated', updated);
    } catch (err) {
      next(err);
    }
  }
};
