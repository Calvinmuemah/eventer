import { contactService } from '../services/contact.service.js';
import { validateContactMessage } from '../validators/index.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const contactController = {
  async createContactMessage(req, res, next) {
    try {
      validateContactMessage(req.body);
      const record = await contactService.saveMessage(req.body);
      return sendSuccess(res, 'Thank you for contacting MC TITOE EVENTS AND DESIGNS. Your message has been received.', record, 201);
    } catch (err) {
      next(err);
    }
  }
};
