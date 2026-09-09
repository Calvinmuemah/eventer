import db from '../db/index.js';
import { quotesRepository } from '../repositories/quotes.repository.js';
import { bookingsRepository } from '../repositories/bookings.repository.js';
import { notFound, badRequest } from '../utils/apiError.js';

export const quotesService = {
  async getQuoteById(id) {
    const quote = await quotesRepository.findById(id);
    if (!quote) {
      throw notFound(`Quote with ID '${id}' was not found.`);
    }
    return quote;
  },

  async acceptQuote(id) {
    const quote = await quotesRepository.findById(id);
    if (!quote) {
      throw notFound(`Quote with ID '${id}' was not found.`);
    }

    if (quote.status === 'Accepted') {
      const existingBooking = await bookingsRepository.findByQuoteId(quote.id);
      if (existingBooking) {
        return {
          quote,
          booking: existingBooking,
          alreadyAccepted: true,
        };
      }
    }

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // Update quote status to Accepted
      const updatedQuote = await quotesRepository.updateStatus(quote.id, 'Accepted', null, client);

      // Create Booking
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const bookingReference = `BKG-${Date.now().toString().slice(-4)}-${randomSuffix}`;

      const bookingServices = (quote.items || []).map((item) => ({
        serviceId: item.service_id,
        serviceName: item.service_name,
        price: item.total_price,
      }));

      const booking = await bookingsRepository.create({
        bookingReference,
        eventRequestId: quote.event_request_id,
        quoteId: quote.id,
        totalAmount: quote.total,
        amountPaid: 0.00,
        balance: quote.total,
        paymentStatus: 'Pending',
        bookingStatus: 'Pending',
        notes: `Created from accepted quote ${quote.quote_number}`,
      }, bookingServices, client);

      await client.query('COMMIT');

      const fullBooking = await bookingsRepository.findById(booking.id);
      return {
        quote: updatedQuote,
        booking: fullBooking,
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async requestChanges(id, changeNotes) {
    const quote = await quotesRepository.findById(id);
    if (!quote) {
      throw notFound(`Quote with ID '${id}' was not found.`);
    }

    if (quote.status === 'Accepted') {
      throw badRequest('Quote has already been accepted. Please contact our team directly for modifications.');
    }

    const updated = await quotesRepository.updateStatus(id, 'Change Requested', changeNotes);
    return updated;
  }
};
