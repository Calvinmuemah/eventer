import { Router } from 'express';
import { paymentsController } from '../controllers/payments.controller.js';

const router = Router();

router.get('/:bookingId', paymentsController.getPaymentDetails);
router.post('/:bookingId/initiate', paymentsController.initiatePayment);

export default router;
