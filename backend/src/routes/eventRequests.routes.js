import { Router } from 'express';
import { eventRequestsController } from '../controllers/eventRequests.controller.js';
import { publicFormLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/', publicFormLimiter, eventRequestsController.createEventRequest);
router.get('/:id', eventRequestsController.getEventRequestById);

export default router;
