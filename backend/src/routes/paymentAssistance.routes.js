import { Router } from 'express';
import { paymentAssistanceController } from '../controllers/paymentAssistance.controller.js';
import { publicFormLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', publicFormLimiter, paymentAssistanceController.createRequest);

export default router;
