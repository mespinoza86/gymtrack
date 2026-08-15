/* Protección contra peticiones falsificadas desde otro sitio (CSRF).

   Todo aquí es puro: el middleware se ejecuta con peticiones y respuestas
   simuladas, sin servidor ni base de datos. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { attachCsrf, verifyCsrf, issueCsrf, CSRF_COOKIE } from '../src/middleware/csrf.js';

/* Simula lo poco que el middleware usa de Express: la lectura de cabeceras y
   el envío de cookies. */
function contexto({ method = 'POST', user = null, header = null, token = null } = {}) {
  const cookies = [];
  const req = {
    method,
    session: user ? { user, ...(token ? { csrfToken: token } : {}) } : {},
    get: (name) => (name.toLowerCase() === 'x-csrf-token' ? header : undefined),
  };
  const res = { cookie: (nombre, valor, opciones) => cookies.push({ nombre, valor, opciones }) };
  return { req, res, cookies };
}

function correr(middleware, { req, res }) {
  let error;
  let continuo = false;
  middleware(req, res, (e) => {
    if (e) error = e;
    else continuo = true;
  });
  return { continuo, status: error?.status, code: error?.code };
}

test('los métodos que solo leen no necesitan token', () => {
  for (const method of ['GET', 'HEAD', 'OPTIONS']) {
    const ctx = contexto({ method, user: { id: 'u' }, token: 'abc' });
    assert.equal(correr(verifyCsrf, ctx).continuo, true, `${method} debería pasar`);
  }
});

test('sin sesión autenticada no se exige token', () => {
  /* Es el caso de entrar, registrarse o pedir recuperar la contraseña: no hay
     estado autenticado del que abusar. */
  const ctx = contexto({ method: 'POST', user: null });
  assert.equal(correr(verifyCsrf, ctx).continuo, true);
});

test('con sesión, una petición sin cabecera se rechaza', () => {
  const ctx = contexto({ user: { id: 'u' }, token: 'esperado', header: null });
  const resultado = correr(verifyCsrf, ctx);
  assert.equal(resultado.continuo, false);
  assert.equal(resultado.status, 403);
  assert.equal(resultado.code, 'csrf_invalid');
});

test('con sesión, una cabecera equivocada se rechaza', () => {
  for (const header of ['otro', '', 'esperad', 'esperadoo']) {
    const ctx = contexto({ user: { id: 'u' }, token: 'esperado', header });
    assert.equal(correr(verifyCsrf, ctx).status, 403, `"${header}" no debería aceptarse`);
  }
});

test('con sesión y la cabecera correcta se deja pasar', () => {
  const ctx = contexto({ user: { id: 'u' }, token: 'esperado', header: 'esperado' });
  assert.equal(correr(verifyCsrf, ctx).continuo, true);
});

test('una sesión sin token todavía no acepta nada', () => {
  /* Si la sesión no tiene token, ninguna cabecera debe servir; en particular
     no debe colar una cadena vacía contra un valor ausente. */
  const ctx = contexto({ user: { id: 'u' }, token: null, header: '' });
  assert.equal(correr(verifyCsrf, ctx).status, 403);
});

test('attachCsrf crea el token y lo entrega en una cookie legible', () => {
  const ctx = contexto({ method: 'GET', user: { id: 'u' } });
  correr(attachCsrf, ctx);

  assert.equal(ctx.cookies.length, 1);
  const [cookie] = ctx.cookies;
  assert.equal(cookie.nombre, CSRF_COOKIE);
  assert.equal(cookie.valor.length, 64, 'deben ser 32 bytes en hexadecimal');
  /* Debe poder leerla el JavaScript de la página: si fuera httpOnly, el
     navegador no podría componer la cabecera y todo dejaría de funcionar. */
  assert.equal(cookie.opciones.httpOnly, false);
  assert.equal(cookie.opciones.sameSite, 'lax');
});

test('attachCsrf no crea sesión para quien no ha entrado', () => {
  const ctx = contexto({ method: 'GET', user: null });
  correr(attachCsrf, ctx);
  assert.equal(ctx.cookies.length, 0, 'un visitante anónimo no debe recibir cookie');
});

test('el token se conserva mientras dure la sesión y es distinto en cada una', () => {
  const ctx = contexto({ method: 'GET', user: { id: 'u' } });
  const primero = issueCsrf(ctx.req, ctx.res);
  const segundo = issueCsrf(ctx.req, ctx.res);
  assert.equal(primero, segundo, 'no debe regenerarse en cada petición');

  const otra = contexto({ method: 'GET', user: { id: 'v' } });
  assert.notEqual(issueCsrf(otra.req, otra.res), primero);
});

test('la protección está conectada y en el orden correcto', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');

  const sesion = app.indexOf('app.use(sessionMiddleware)');
  const adjunta = app.indexOf('app.use(attachCsrf)');
  const verifica = app.indexOf('app.use(verifyCsrf)');
  /* Se busca la ruta y no `app.use('/api/auth'`, porque ese montaje está
     partido en varias líneas junto a su limitador. */
  const primeraRuta = app.indexOf("'/api/auth'");

  assert.ok(sesion !== -1 && adjunta !== -1 && verifica !== -1, 'deben estar montados');
  /* Sin sesión no hay dónde guardar el token, y después de las rutas la
     comprobación llegaría tarde. */
  assert.ok(sesion < adjunta, 'attachCsrf va después de la sesión');
  assert.ok(adjunta < verifica, 'primero se entrega el token y luego se exige');
  assert.ok(verifica < primeraRuta, 'la comprobación va antes de cualquier ruta');
});

test('el navegador manda la cabecera solo en lo que cambia algo', async () => {
  const api = await readFile(new URL('../public/js/comun/api.js', import.meta.url), 'utf8');

  /* La barra invertida es opcional a propósito: en el código el nombre de la
     cookie vive dentro de una expresión regular, donde el punto va escapado
     como `gymtrack\.csrf`. */
  assert.match(api, /gymtrack\\?\.csrf/, 'debe leer la cookie del token');
  assert.match(api, /'X-CSRF-Token'/, 'debe enviar la cabecera');
  assert.match(api, /SAFE_METHODS/, 'debe distinguir los métodos que solo leen');
});

test('todas las peticiones del navegador pasan por api()', async () => {
  /* La cabecera se añade en un único sitio. Si algún módulo llamara a `fetch`
     por su cuenta, se saltaría el token y su función dejaría de funcionar en
     cuanto el usuario tuviera sesión. Esta comprobación lo impide. */
  const { readdir } = await import('node:fs/promises');
  const raiz = new URL('../public/js/', import.meta.url);
  const archivos = await readdir(raiz, { recursive: true });

  const infractores = [];
  for (const nombre of archivos) {
    if (!nombre.endsWith('.js')) continue;
    const ruta = nombre.replaceAll('\\', '/');
    if (ruta === 'comun/api.js') continue;

    const source = await readFile(new URL(ruta, raiz), 'utf8');
    if (/\bfetch\s*\(/.test(source)) infractores.push(ruta);
  }

  assert.deepEqual(
    infractores,
    [],
    'estos módulos llaman a fetch directamente y se saltarían el token',
  );
});
