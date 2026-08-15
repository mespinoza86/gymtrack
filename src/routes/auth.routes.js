import { Router } from 'express';
import rateLimit from 'express-rate-limit';
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

const email = z.email().transform((value) => value.trim().toLowerCase());
/* El token viaja en la URL del correo: 32 bytes en hexadecimal. */
const token = z.string().regex(/^[a-f0-9]{64}$/, 'Enlace inválido');

/* Límite propio y mucho más estricto que el general de `/api/auth`, porque
   estos endpoints envían correo: son a la vez un vector de abuso contra
   terceros y un gasto de la cuota diaria del proveedor. */
const mailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Espera un momento antes de volver a intentarlo.' },
});

router.post(
  '/register',
  validate(
    z.object({
      email,
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
  validate(z.object({ email, password: z.string().min(1) })),
  asyncHandler(controller.login),
);

/* Recuperación de contraseña y confirmación de correo. Las tres que envían
   correo llevan el límite estricto; aplicar la contraseña nueva no lo lleva,
   porque quien tiene un token válido ya demostró controlar el buzón. */
router.post(
  '/forgot-password',
  mailLimiter,
  validate(z.object({ email })),
  asyncHandler(controller.forgotPassword),
);

router.post(
  '/reset-password',
  validate(z.object({ token, password })),
  asyncHandler(controller.resetPassword),
);

router.post('/verify-email', validate(z.object({ token })), asyncHandler(controller.verifyEmail));

router.post(
  '/resend-verification',
  mailLimiter,
  validate(z.object({ email })),
  asyncHandler(controller.resendVerification),
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
