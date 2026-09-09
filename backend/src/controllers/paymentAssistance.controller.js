import { paymentAssistanceService } from '../services/paymentAssistance.service.js';
import { validatePaymentAssistance } from '../validators/index.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const paymentAssistanceController = {
  async createRequest(req, res, next) {
    try {
      validatePaymentAssistance(req.body);
      const record = await paymentAssistanceService.requestAssistance(req.body);
      return sendSuccess(res, 'Your payment assistance request has been received. Our concierge team will reach out promptly.', record, 201);
    } catch (err) {
      next(err);
    }
  }
};
