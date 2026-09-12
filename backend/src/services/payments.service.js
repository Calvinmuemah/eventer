import db from '../db/index.js';
import { bookingsRepository } from '../repositories/bookings.repository.js';
import { paymentsRepository } from '../repositories/payments.repository.js';
import { notFound, badRequest } from '../utils/apiError.js';

export const paymentsService = {
  async getPaymentDetails(bookingId) {
    const booking = await bookingsRepository.findById(bookingId);
    if (!booking) {
      throw notFound(`Booking with ID '${bookingId}' was not found.`);
    }
    const payments = await paymentsRepository.findByBookingId(bookingId);

    return {
      bookingId: booking.id,
      bookingReference: booking.booking_reference,
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      eventType: booking.event_type,
      eventDate: booking.event_date,
      eventLocation: booking.event_location,
      services: booking.services,
      totalAmount: parseFloat(booking.total_amount),
      amountPaid: parseFloat(booking.amount_paid),
      balance: parseFloat(booking.balance),
      paymentStatus: booking.payment_status,
      bookingStatus: booking.booking_status,
      payments,
      availableMethods: [
        { id: 'card', name: 'Credit / Debit Card (Visa, Mastercard, Amex)', icon: 'CreditCard' },
        { id: 'mobile_money', name: 'M-Pesa / Mobile Money', icon: 'Smartphone' },
        { id: 'bank_transfer', name: 'Direct Bank Wire Transfer', icon: 'Building2' }
      ]
    };
  },

  async initiatePayment(bookingId, paymentData = {}) {
    const booking = await bookingsRepository.findById(bookingId);
    if (!booking) {
      throw notFound(`Booking with ID '${bookingId}' was not found.`);
    }

    const currentBalance = parseFloat(booking.balance);
    if (currentBalance <= 0 && booking.payment_status === 'Paid') {
      throw badRequest('This booking is already fully settled.');
    }

    const amountToPay = paymentData.amount ? parseFloat(paymentData.amount) : currentBalance;
    if (isNaN(amountToPay) || amountToPay <= 0) {
      throw badRequest('Invalid payment amount requested.');
    }

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const transactionReference = `TX-${Date.now().toString().slice(-4)}-${randomSuffix}`;
      const paymentMethod = paymentData.paymentMethod || 'card';

      // Record payment attempt (Clearly labeled as mock/development sandbox payment until live gateway credentials are provided)
      const paymentRecord = await paymentsRepository.create({
        bookingId: booking.id,
        transactionReference,
        amount: amountToPay,
        currency: 'KES',
        provider: 'mock_sandbox_gateway',
        paymentMethod,
        status: 'Paid',
        providerResponse: {
          mode: 'sandbox_simulation',
          note: 'Processed via development mock gateway. Plug in live credentials for production processing.',
          timestamp: new Date().toISOString(),
          simulatedMethod: paymentMethod,
        }
      }, client);

      const newAmountPaid = parseFloat(booking.amount_paid) + amountToPay;
      const newBalance = Math.max(0, parseFloat(booking.total_amount) - newAmountPaid);
      const newPaymentStatus = newBalance === 0 ? 'Paid' : 'Partial';
      const newBookingStatus = 'Confirmed';

      const updatedBooking = await bookingsRepository.updatePaymentState(
        booking.id,
        newPaymentStatus,
        newAmountPaid,
        newBalance,
        newBookingStatus,
        client
      );

      await client.query('COMMIT');

      return {
        isSandbox: true,
        payment: paymentRecord,
        booking: updatedBooking,
        message: 'Sandbox payment processed successfully. Booking is now confirmed.',
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
};
