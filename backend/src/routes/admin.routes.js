import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';

const router = Router();

// Dashboard overview
router.get('/stats', adminController.getDashboardStats);

// Services CRUD
router.get('/services', adminController.getAllServices);
router.post('/services', adminController.createService);
router.put('/services/:id', adminController.updateService);
router.delete('/services/:id', adminController.deleteService);

// Event Requests
router.get('/event-requests', adminController.getAllEventRequests);
router.patch('/event-requests/:id/status', adminController.updateEventRequestStatus);

// Quotes
router.get('/quotes', adminController.getAllQuotes);
router.put('/quotes/:id', adminController.updateQuote);

// Bookings
router.get('/bookings', adminController.getAllBookings);
router.patch('/bookings/:id/status', adminController.updateBookingStatus);

// Payments Ledger
router.get('/payments', adminController.getAllPayments);

// Payment Assistance Inquiries
router.get('/payment-assistance', adminController.getAllPaymentAssistance);
router.patch('/payment-assistance/:id/status', adminController.updatePaymentAssistanceStatus);

// Contact Messages
router.get('/contact-messages', adminController.getAllContactMessages);
router.patch('/contact-messages/:id/read', adminController.toggleContactMessageRead);

export default router;
