import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { requireAdminAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', authController.login);
router.get('/me', requireAdminAuth, authController.getMe);
router.post('/logout', authController.logout);

export default router;
