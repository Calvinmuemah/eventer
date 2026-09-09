import { eventRequestsService } from '../services/eventRequests.service.js';
import { validateEventRequest } from '../validators/index.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const eventRequestsController = {
  async createEventRequest(req, res, next) {
    try {
      validateEventRequest(req.body);
      const result = await eventRequestsService.createEventRequest(req.body);
      return sendSuccess(res, 'Event request submitted successfully. A provisional quotation has been prepared.', result, 201);
    } catch (err) {
      next(err);
    }
  },

  async getEventRequestById(req, res, next) {
    try {
      const { id } = req.params;
      const request = await eventRequestsService.getEventRequestById(id);
      return sendSuccess(res, 'Event request retrieved successfully', request);
    } catch (err) {
      next(err);
    }
  }
};
