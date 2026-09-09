import { Router } from 'express';
import { bookingsController } from '../controllers/bookings.controller.js';

const router = Router();

router.get('/:id', bookingsController.getBookingById);

export default router;
