import { HttpError } from '../utils/http-error.js';

export function requireAuth(req, res, next) {
  if (!req.session?.user) return next(new HttpError(401, 'Debes iniciar sesión'));
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session?.user) return next(new HttpError(401, 'Debes iniciar sesión'));
    if (!roles.includes(req.session.user.role))
      return next(new HttpError(403, 'No tienes permiso para realizar esta acción'));
    next();
  };
}
