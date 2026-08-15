/* Protección contra CSRF (peticiones falsificadas desde otro sitio).

   Hasta ahora la única defensa era `sameSite=lax` en la cookie de sesión, que
   cubre bastante pero no todo: no protege frente a un atacante en el mismo
   sitio y depende por completo del navegador.

   El esquema es un token sincronizado. Se guarda un valor aleatorio en la
   sesión y se entrega al navegador en una cookie legible; el navegador lo
   devuelve en la cabecera `X-CSRF-Token` y el servidor compara ambos. Un sitio
   ajeno puede provocar que el navegador envíe la cookie de sesión, pero **no
   puede leer la cookie del token** ni, por tanto, componer la cabecera.

   Se exige únicamente cuando ya existe una sesión con usuario. Los endpoints
   sin sesión —entrar, registrarse, recuperar la contraseña— no tienen estado
   autenticado que abusar, y exigirles token obligaría a crear una sesión en la
   base de datos por cada visitante anónimo, incluidos los robots. */

import crypto from 'node:crypto';
import { HttpError } from '../utils/http-error.js';
import { env } from '../config/environment.js';

export const CSRF_COOKIE = 'gymtrack.csrf';
export const CSRF_HEADER = 'x-csrf-token';

/* Los métodos que solo leen no cambian nada, así que no necesitan token. */
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/* Comparación en tiempo constante. Con longitudes distintas se responde antes,
   pero eso solo revela la longitud, que no es secreta. */
function sameToken(a, b) {
  const uno = Buffer.from(String(a ?? ''), 'utf8');
  const otro = Buffer.from(String(b ?? ''), 'utf8');
  if (uno.length === 0 || uno.length !== otro.length) return false;
  return crypto.timingSafeEqual(uno, otro);
}

/* Entrega el token al navegador. La cookie NO es `httpOnly` a propósito: el
   JavaScript de la propia página tiene que leerla para componer la cabecera.
   Eso no la debilita, porque el origen ajeno no puede leer cookies de este. */
export function issueCsrf(req, res) {
  if (!req.session) return null;
  req.session.csrfToken ??= crypto.randomBytes(32).toString('hex');

  res.cookie(CSRF_COOKIE, req.session.csrfToken, {
    httpOnly: false,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    path: '/',
  });

  return req.session.csrfToken;
}

/* Se ejecuta en cada petición. Si hay usuario y todavía no hay token, lo crea:
   así las sesiones abiertas antes de existir esta protección se ponen al día
   solas, sin obligar a nadie a volver a entrar. */
export function attachCsrf(req, res, next) {
  if (req.session?.user) issueCsrf(req, res);
  next();
}

export function verifyCsrf(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  /* Sin sesión autenticada no hay nada que falsificar en nombre de nadie. */
  if (!req.session?.user) return next();

  if (!sameToken(req.get(CSRF_HEADER), req.session.csrfToken))
    return next(
      new HttpError(
        403,
        'La solicitud no superó la comprobación de seguridad. Recarga la página e inténtalo de nuevo.',
        undefined,
        'csrf_invalid',
      ),
    );

  next();
}
