import db from '../db/index.js';
import { quotesRepository } from '../repositories/quotes.repository.js';
import { bookingsRepository } from '../repositories/bookings.repository.js';
import { notFound, badRequest } from '../utils/apiError.js';
import { emailService } from './email.service.js';


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

      // Asynchronously send booking confirmation email to customer
      if (fullBooking?.customer_email) {
        emailService.sendBookingConfirmationEmail({
          to: fullBooking.customer_email,
          fullName: fullBooking.customer_name,
          bookingReference: fullBooking.booking_reference,
          quoteNumber: fullBooking.quote_number,
          eventType: fullBooking.event_type,
          eventDate: fullBooking.event_date,
          eventLocation: fullBooking.event_location,
          guestCount: fullBooking.guest_count,
          totalAmount: fullBooking.total_amount,
          amountPaid: fullBooking.amount_paid,
          balance: fullBooking.balance,
          bookingId: fullBooking.id,
        }).catch((err) => {
          console.warn('[QuotesService] Background email dispatch warning:', err.message);
        });
      }

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
