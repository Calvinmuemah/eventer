import { Router } from 'express';
import servicesRoutes from './services.routes.js';
import eventRequestsRoutes from './eventRequests.routes.js';
import quotesRoutes from './quotes.routes.js';
import bookingsRoutes from './bookings.routes.js';
import paymentsRoutes from './payments.routes.js';
import paymentAssistanceRoutes from './paymentAssistance.routes.js';
import contactRoutes from './contact.routes.js';
import adminRoutes from './admin.routes.js';
import authRoutes from './auth.routes.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

// Root v1 status
router.get('/', (req, res) => {
  return sendSuccess(res, 'Eventer API is running', {
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'eventa-api', timestamp: new Date().toISOString() });
});

// Public Authentication endpoints
router.use('/auth', authRoutes);
router.use('/admin/auth', authRoutes); // convenient alias

// Public Client endpoints
router.use('/services', servicesRoutes);
router.use('/event-requests', eventRequestsRoutes);
router.use('/quotes', quotesRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/payments', paymentsRoutes);
router.use('/payment-assistance', paymentAssistanceRoutes);
router.use('/contact', contactRoutes);

// Protected Admin operations endpoints
router.use('/admin', requireAdminAuth, adminRoutes);

export default router;
