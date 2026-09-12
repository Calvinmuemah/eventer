import db from '../db/index.js';
import { eventRequestsRepository } from '../repositories/eventRequests.repository.js';
import { servicesRepository } from '../repositories/services.repository.js';
import { quotesRepository } from '../repositories/quotes.repository.js';
import { notFound, badRequest } from '../utils/apiError.js';
import { normalizeKenyanPhone } from '../utils/phone.js';

// Base pricing estimation per service in KSh for provisional quotation generation
const ESTIMATED_PRICES = {
  'mc': 45000.00,
  'public-address-system': 85000.00,
  'musical-instruments': 70000.00,
  'events-planning': 120000.00,
  'decoration-lighting': 150000.00,
  'more': 50000.00,
};

export const eventRequestsService = {
  async createEventRequest(data) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Verify selected services exist
      const services = await servicesRepository.findByIds(data.serviceIds);
      if (services.length === 0) {
        throw badRequest('None of the selected services could be found.');
      }

      // Generate clean reference code
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const referenceCode = `EVT-${Date.now().toString().slice(-4)}-${randomSuffix}`;

      // Insert event request with normalized Kenyan phone
      const eventRequest = await eventRequestsRepository.create({
        ...data,
        phone: normalizeKenyanPhone(data.phone),
        referenceCode,
      }, client);

      // Link services
      await eventRequestsRepository.linkServices(eventRequest.id, data.serviceIds, client);

      // Generate initial Quote so client can immediately view quote and proceed through the workflow
      const quoteNumber = `QTE-${Date.now().toString().slice(-4)}-${randomSuffix}`;
      
      const quoteItems = services.map((s) => {
        const unitPrice = ESTIMATED_PRICES[s.slug] || 50000.00;
        return {
          serviceId: s.id,
          serviceName: s.name,
          description: s.short_description,
          unitPrice,
          quantity: 1,
          totalPrice: unitPrice,
        };
      });

      const subtotal = quoteItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
      const discount = 0.00;
      const total = subtotal - discount;

      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 14); // valid for 14 days

      const quote = await quotesRepository.create({
        quoteNumber,
        eventRequestId: eventRequest.id,
        subtotal,
        discount,
        total,
        notes: 'Initial quotation based on submitted event specifications. Subject to customized adjustments upon detailed venue walkthrough.',
        status: 'Sent',
        validUntil: validUntil.toISOString().split('T')[0],
      }, quoteItems, client);

      await client.query('COMMIT');

      const fullRequest = await eventRequestsRepository.findById(eventRequest.id);
      return {
        eventRequest: fullRequest,
        quoteId: quote.id,
        quoteNumber: quote.quote_number,
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async getEventRequestById(id) {
    const request = await eventRequestsRepository.findById(id);
    if (!request) {
      throw notFound(`Event request with ID '${id}' was not found.`);
    }
    return request;
  },

  async getEventRequestByReference(ref) {
    const request = await eventRequestsRepository.findByReference(ref);
    if (!request) {
      throw notFound(`Event request with reference '${ref}' was not found.`);
    }
    return request;
  }
};
