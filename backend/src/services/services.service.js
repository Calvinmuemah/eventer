import { servicesRepository } from '../repositories/services.repository.js';
import { notFound } from '../utils/apiError.js';

export const servicesService = {
  async getAllServices() {
    return await servicesRepository.findAll();
  },

  async getServiceBySlug(slug) {
    const service = await servicesRepository.findBySlug(slug);
    if (!service) {
      throw notFound(`Service with slug '${slug}' was not found.`);
    }
    return service;
  },

  async getServiceById(id) {
    const service = await servicesRepository.findById(id);
    if (!service) {
      throw notFound(`Service with ID '${id}' was not found.`);
    }
    return service;
  }
};
