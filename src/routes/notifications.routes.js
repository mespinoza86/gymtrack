import { Router } from 'express';
import { z } from 'zod';
import * as controller from '../controllers/notifications.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();
router.use(requireAuth);
router.get('/', asyncHandler(controller.list));
router.get('/unread-count', asyncHandler(controller.unread));
/* La ruta fija debe ir antes de la que recibe un UUID. */
router.put('/read-all', asyncHandler(controller.markAllRead));
router.put(
  '/:id/read',
  validate(z.object({ id: z.uuid() }), 'params'),
  asyncHandler(controller.markRead),
);

export default router;
