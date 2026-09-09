import { paymentAssistanceRepository } from '../repositories/paymentAssistance.repository.js';
import { bookingsRepository } from '../repositories/bookings.repository.js';

export const paymentAssistanceService = {
  async requestAssistance(data) {
    let booking = null;
    try {
      booking = await bookingsRepository.findByReference(data.bookingReference);
    } catch (e) {
      // Non-blocking if reference is not found in database yet
    }

    const record = await paymentAssistanceRepository.create({
      bookingReference: data.bookingReference,
      bookingId: booking ? booking.id : null,
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: data.message,
    });

    if (booking) {
      await bookingsRepository.updatePaymentStatusOnly(booking.id, 'Assistance Requested');
    }

    return record;
  }
};
