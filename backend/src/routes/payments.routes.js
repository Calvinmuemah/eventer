import { Router } from 'express';
import { paymentsController } from '../controllers/payments.controller.js';

const router = Router();

// Paystack webhook listener
router.post('/webhook/paystack', paymentsController.handleWebhook);

// Booking payment operations
router.get('/:bookingId', paymentsController.getPaymentDetails);
router.post('/:bookingId/initiate', paymentsController.initiatePayment);
router.post('/:bookingId/verify', paymentsController.verifyPayment);

export default router;
