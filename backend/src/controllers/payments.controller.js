import { paymentsService } from '../services/payments.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const paymentsController = {
  async getPaymentDetails(req, res, next) {
    try {
      const { bookingId } = req.params;
      const details = await paymentsService.getPaymentDetails(bookingId);
      return sendSuccess(res, 'Payment details retrieved successfully', details);
    } catch (err) {
      next(err);
    }
  },

  async initiatePayment(req, res, next) {
    try {
      const { bookingId } = req.params;
      const result = await paymentsService.initiatePayment(bookingId, req.body);
      return sendSuccess(res, result.message, result);
    } catch (err) {
      next(err);
    }
  },

  async verifyPayment(req, res, next) {
    try {
      const { bookingId } = req.params;
      const result = await paymentsService.verifyPayment(bookingId, req.body);
      return sendSuccess(res, result.message, result);
    } catch (err) {
      next(err);
    }
  },

  async handleWebhook(req, res, next) {
    try {
      const signature = req.headers['x-paystack-signature'];
      const result = await paymentsService.handleWebhook(req.body, signature, req.body);
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
};
