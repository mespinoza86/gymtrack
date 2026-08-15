/* Seguridad de la sesión: fijación y limpieza al salir.

   El comportamiento real se comprueba por HTTP contra un servidor levantado,
   porque depende de `express-session`. Lo que se puede comprobar sin servidor
   es que el código siga escrito de la única forma correcta, que es el orden de
   las operaciones: regenerar primero, guardar el usuario después. */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const controlador = await readFile(
  new URL('../src/controllers/auth.controller.js', import.meta.url),
  'utf8',
);

test('el acceso renueva el identificador de sesión', () => {
  assert.match(
    controlador,
    /session\.regenerate/,
    'login debe regenerar la sesión para cerrar la fijación de sesión',
  );
});

test('el usuario se guarda DESPUÉS de regenerar, no antes', () => {
  const login = controlador.slice(
    controlador.indexOf('export async function login'),
    controlador.indexOf('export function logout'),
  );

  const regenera = login.indexOf('regenerarSesion');
  const guarda = login.indexOf('req.session.user =');

  assert.ok(regenera !== -1 && guarda !== -1, 'deben existir ambas operaciones');
  /* Invertir el orden anularía la protección **y** perdería al usuario:
     `regenerate` deja una sesión vacía, así que borraría lo recién guardado. */
  assert.ok(regenera < guarda, 'regenerar después de guardar borraría al usuario y no protegería');
});

test('el token contra falsificación se emite después de regenerar', () => {
  const login = controlador.slice(
    controlador.indexOf('export async function login'),
    controlador.indexOf('export function logout'),
  );

  /* La sesión nueva nace sin token; emitirlo antes lo dejaría huérfano y la
     primera escritura después de entrar sería rechazada. */
  assert.ok(
    login.indexOf('regenerarSesion') < login.indexOf('issueCsrf'),
    'el token debe emitirse sobre la sesión ya renovada',
  );
});

test('al cerrar sesión se retira la cookie del token', () => {
  assert.match(controlador, /clearCookie\(CSRF_COOKIE/);
});
