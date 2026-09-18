import { paymentAssistanceRepository } from '../repositories/paymentAssistance.repository.js';
import { bookingsRepository } from '../repositories/bookings.repository.js';
import { emailService } from './email.service.js';
import { normalizeKenyanPhone } from '../utils/phone.js';

export const paymentAssistanceService = {
  async requestAssistance(data) {
    let booking = null;
    try {
      booking = await bookingsRepository.findByReference(data.bookingReference);
    } catch (e) {
      // Non-blocking if reference is not found in database yet
    }

    const cleanPhone = normalizeKenyanPhone(data.phone);

    const record = await paymentAssistanceRepository.create({
      bookingReference: data.bookingReference,
      bookingId: booking ? booking.id : null,
      name: data.name,
      phone: cleanPhone,
      email: data.email,
      message: data.message,
    });

    if (booking) {
      await bookingsRepository.updatePaymentStatusOnly(booking.id, 'Assistance Requested');
    }

    // Trigger urgent email notification to MC Titoe owner & acknowledgment to customer
    emailService.sendPaymentAssistanceNotificationEmail({
      name: data.name,
      phone: cleanPhone,
      email: data.email,
      bookingReference: data.bookingReference,
      message: data.message,
      balance: booking ? booking.balance : null,
      eventType: booking ? booking.event_type : null,
      eventDate: booking ? booking.event_date : null,
    }).catch((err) => console.warn('[PaymentAssistanceService] Email notification warning:', err.message));

    return record;
  }
};
