import { Router } from 'express';
import { z } from 'zod';
import * as controller from '../controllers/links.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();
router.use(requireAuth);
router.get('/people', asyncHandler(controller.people));
router.post('/invitations', requireRole('trainer'), asyncHandler(controller.create));
router.get('/invitations', requireRole('trainer'), asyncHandler(controller.invitations));
router.post('/accept', requireRole('athlete'), validate(z.object({ code: z.string().trim().min(8).max(20) })), asyncHandler(controller.accept));
export default router;
