import { bookingsService } from '../services/bookings.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const bookingsController = {
  async getBookingById(req, res, next) {
    try {
      const { id } = req.params;
      const booking = await bookingsService.getBookingById(id);
      return sendSuccess(res, 'Booking retrieved successfully', booking);
    } catch (err) {
      next(err);
    }
  }
};
