import { Router } from 'express';
import { servicesController } from '../controllers/services.controller.js';

const router = Router();

router.get('/', servicesController.getAllServices);
router.get('/:slug', servicesController.getServiceBySlug);

export default router;
