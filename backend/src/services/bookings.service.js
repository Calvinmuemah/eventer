import { bookingsRepository } from '../repositories/bookings.repository.js';
import { notFound } from '../utils/apiError.js';

export const bookingsService = {
  async getBookingById(id) {
    const booking = await bookingsRepository.findById(id);
    if (!booking) {
      throw notFound(`Booking with ID '${id}' was not found.`);
    }
    return booking;
  },

  async getBookingByReference(reference) {
    const booking = await bookingsRepository.findByReference(reference);
    if (!booking) {
      throw notFound(`Booking with reference '${reference}' was not found.`);
    }
    return booking;
  }
};
