import { quotesService } from '../services/quotes.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const quotesController = {
  async getQuoteById(req, res, next) {
    try {
      const { id } = req.params;
      const quote = await quotesService.getQuoteById(id);
      return sendSuccess(res, 'Quote retrieved successfully', quote);
    } catch (err) {
      next(err);
    }
  },

  async acceptQuote(req, res, next) {
    try {
      const { id } = req.params;
      const result = await quotesService.acceptQuote(id);
      return sendSuccess(res, 'Quotation accepted. Booking created successfully.', result);
    } catch (err) {
      next(err);
    }
  },

  async requestChanges(req, res, next) {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const updated = await quotesService.requestChanges(id, notes);
      return sendSuccess(res, 'Change request recorded. Our event coordinator will review your requested adjustments.', updated);
    } catch (err) {
      next(err);
    }
  }
};
