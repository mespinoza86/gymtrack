import { ZodError } from 'zod';

export function notFound(req, res) {
  res.status(404).json({ error: 'Recurso no encontrado' });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Datos inválidos',
      details: error.issues.map(({ path, message }) => ({ field: path.join('.'), message }))
    });
  }
  const status = error.status ?? 500;
  if (status >= 500) console.error(error);
  return res.status(status).json({ error: status >= 500 ? 'Error interno del servidor' : error.message });
}
