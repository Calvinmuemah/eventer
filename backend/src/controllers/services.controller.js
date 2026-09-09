import { servicesService } from '../services/services.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const servicesController = {
  async getAllServices(req, res, next) {
    try {
      const services = await servicesService.getAllServices();
      return sendSuccess(res, 'Services retrieved successfully', services);
    } catch (err) {
      next(err);
    }
  },

  async getServiceBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const service = await servicesService.getServiceBySlug(slug);
      return sendSuccess(res, 'Service details retrieved successfully', service);
    } catch (err) {
      next(err);
    }
  }
};
