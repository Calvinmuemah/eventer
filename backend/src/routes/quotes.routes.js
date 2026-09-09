import { Router } from 'express';
import { quotesController } from '../controllers/quotes.controller.js';

const router = Router();

router.get('/:id', quotesController.getQuoteById);
router.post('/:id/accept', quotesController.acceptQuote);
router.post('/:id/request-changes', quotesController.requestChanges);

export default router;
