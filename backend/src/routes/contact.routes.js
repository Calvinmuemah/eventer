import { Router } from 'express';
import { contactController } from '../controllers/contact.controller.js';
import { publicFormLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', publicFormLimiter, contactController.createContactMessage);

export default router;
