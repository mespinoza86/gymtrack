import { Router } from 'express';
import { z } from 'zod';
import * as controller from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();
const password = z
  .string()
  .min(8)
  .max(72)
  .regex(/[A-Z]/, 'Debe incluir una mayúscula')
  .regex(/[0-9]/, 'Debe incluir un número');

router.post(
  '/register',
  validate(
    z.object({
      email: z.email().transform((value) => value.trim().toLowerCase()),
      password,
      firstName: z.string().trim().min(2).max(80),
      lastName: z.string().trim().min(2).max(120),
      role: z.enum(['trainer', 'athlete']),
    }),
  ),
  asyncHandler(controller.register),
);

router.post(
  '/login',
  validate(
    z.object({
      email: z.email().transform((v) => v.trim().toLowerCase()),
      password: z.string().min(1),
    }),
  ),
  asyncHandler(controller.login),
);
router.post('/logout', requireAuth, controller.logout);
router.get('/me', requireAuth, asyncHandler(controller.me));
router.put(
  '/profile',
  requireAuth,
  validate(
    z.object({
      firstName: z.string().trim().min(2).max(80),
      lastName: z.string().trim().min(2).max(120),
      phone: z.string().trim().max(30).optional().default(''),
      birthDate: z.string().optional().default(''),
    }),
  ),
  asyncHandler(controller.updateProfile),
);
router.put(
  '/password',
  requireAuth,
  validate(
    z.object({
      currentPassword: z.string().min(1).max(72),
      newPassword: password,
    }),
  ),
  asyncHandler(controller.changePassword),
);

export default router;
