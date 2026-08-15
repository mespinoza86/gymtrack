/* Contrato de las pantallas y rutas de correo. No toca la base de datos. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('las rutas de correo están montadas y protegidas', async () => {
  const routes = await read('../src/routes/auth.routes.js');

  for (const path of [
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/resend-verification',
  ])
    assert.match(routes, new RegExp(`'${path}'`), `falta la ruta ${path}`);

  /* Los dos que envían correo deben llevar el límite estricto; los otros dos
     no, porque quien trae un token válido ya demostró controlar el buzón. */
  for (const path of ['/forgot-password', '/resend-verification']) {
    const block = routes.slice(routes.indexOf(`'${path}'`), routes.indexOf(`'${path}'`) + 200);
    assert.match(block, /mailLimiter/, `${path} debe llevar el límite de envío`);
  }

  assert.match(routes, /\[a-f0-9\]\{64\}/, 'el token debe validarse por su forma');
});

test('el proveedor de correo está aislado en un solo módulo', async () => {
  const [mail, service] = await Promise.all([
    read('../src/services/mail.service.js'),
    read('../src/services/auth.service.js'),
  ]);

  /* Los dos proveedores viven en el módulo de correo y en ningún otro sitio.
     Resend está escrito de antemano para el día que exista dominio propio. */
  assert.match(mail, /api\.brevo\.com/, 'el transporte de Brevo vive en el módulo de correo');
  assert.match(mail, /api\.resend\.com/, 'el transporte de Resend vive en el módulo de correo');

  /* Se comprueban los servidores y no los nombres sueltos: el servicio tiene
     una función `resendVerification`, que es reenviar la confirmación y no
     tiene nada que ver con el proveedor Resend. */
  assert.doesNotMatch(service, /brevo/i, 'el servicio de autenticación no debe conocer a Brevo');
  assert.doesNotMatch(
    service,
    /api\.resend\.com/,
    'el servicio de autenticación no debe conocer a Resend',
  );
  assert.match(
    mail,
    /export const outbox/,
    'el transporte de consola debe dejar el mensaje a mano',
  );
});

test('cambiar de proveedor no exige tocar variables de entorno nuevas', async () => {
  const [mail, environment] = await Promise.all([
    read('../src/services/mail.service.js'),
    read('../src/config/environment.js'),
  ]);

  /* Las variables son genéricas a propósito. Si alguien introdujera una
     BREVO_ALGO o RESEND_ALGO, migrar dejaría de ser cambiar un valor. */
  assert.doesNotMatch(
    environment,
    /BREVO_|RESEND_/,
    'las variables deben ser del proveedor neutro',
  );

  for (const transport of ['brevo', 'resend'])
    assert.match(
      mail,
      new RegExp(`=== '${transport}'`),
      `falta la selección del transporte ${transport}`,
    );

  /* La consola no se elige por nombre: es el caso por defecto, para que una
     configuración ausente nunca intente enviar de verdad. */
  assert.match(mail, /return sendWithConsole\(message\)/, 'la consola debe ser el respaldo');
});

test('el token nunca se guarda en claro', async () => {
  const [service, migration] = await Promise.all([
    read('../src/services/auth.service.js'),
    read('../database/migrations/005_email_verification.sql'),
  ]);

  assert.match(service, /createHash\('sha256'\)/, 'el token debe guardarse como hash');
  assert.match(migration, /token_hash/);
  assert.doesNotMatch(
    migration,
    /token TEXT|token VARCHAR/,
    'no debe existir una columna del token en claro',
  );
});

test('las pantallas nuevas cumplen las reglas del proyecto', async () => {
  const pages = {
    'recuperar-clave': await read('../public/recuperar-clave.html'),
    'nueva-clave': await read('../public/nueva-clave.html'),
    'verificar-correo': await read('../public/verificar-correo.html'),
  };

  for (const [name, html] of Object.entries(pages)) {
    /* La política de seguridad bloquea los atributos style. */
    assert.doesNotMatch(html, /\sstyle="/, `${name} no debe traer atributos style`);
    assert.match(html, /theme-init\.js/, `${name} debe aplicar el tema antes de pintar`);
    assert.match(html, new RegExp(`/js/auth/${name}\\.js`), `${name} debe cargar su módulo`);
    assert.match(html, /id="message"/, `${name} necesita su zona de mensajes`);
  }

  assert.match(pages['recuperar-clave'], /id="forgot"/);
  assert.match(pages['nueva-clave'], /id="reset"/);
  assert.match(pages['verificar-correo'], /id="resend"/);

  /* La pantalla de acceso debe ofrecer la salida a quien olvidó la clave. */
  const login = await read('../public/index.html');
  assert.match(login, /href="\/recuperar-clave\.html"/);
});

test('el navegador reacciona al correo sin confirmar', async () => {
  const [api, login] = await Promise.all([
    read('../public/js/comun/api.js'),
    read('../public/js/auth/login.js'),
  ]);

  assert.match(api, /error\.code = data\.code/, 'el cliente debe conservar el código del error');
  assert.match(login, /email_not_verified/, 'el login debe ofrecer el reenvío');
});
