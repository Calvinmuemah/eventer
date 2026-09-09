import { Router } from 'express';
import servicesRoutes from './services.routes.js';
import eventRequestsRoutes from './eventRequests.routes.js';
import quotesRoutes from './quotes.routes.js';
import bookingsRoutes from './bookings.routes.js';
import paymentsRoutes from './payments.routes.js';
import paymentAssistanceRoutes from './paymentAssistance.routes.js';
import contactRoutes from './contact.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'eventa-api', timestamp: new Date().toISOString() });
});

router.use('/services', servicesRoutes);
router.use('/event-requests', eventRequestsRoutes);
router.use('/quotes', quotesRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/payment-assistance', paymentAssistanceRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);

export default router;
