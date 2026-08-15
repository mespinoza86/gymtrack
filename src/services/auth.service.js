import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import * as users from '../repositories/auth.repository.js';
import { env } from '../config/environment.js';
import { HttpError } from '../utils/http-error.js';
import * as mail from './mail.service.js';

const sessionUser = (user) => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name,
  lastName: user.last_name,
  role: user.role,
});

/* Del token solo se guarda el hash. El valor en claro existe únicamente
   dentro de esta función y del enlace que se envía por correo. */
const hashToken = (raw) => crypto.createHash('sha256').update(raw).digest('hex');

async function issueToken(userId, purpose, hours) {
  const raw = crypto.randomBytes(32).toString('hex');
  await users.createToken({
    userId,
    purpose,
    tokenHash: hashToken(raw),
    expiresAt: new Date(Date.now() + hours * 60 * 60 * 1000),
  });
  return raw;
}

const link = (page, token) => `${env.appOrigin}/${page}?token=${token}`;

/* Enviar el correo no debe tumbar la operación que lo pidió, igual que con las
   notificaciones. Aquí además interesa saber si salió, para que la pantalla
   pueda ofrecer un reenvío cuando falle. */
async function trySend(send, description) {
  try {
    await send();
    return true;
  } catch (error) {
    console.error(`[correo] no se pudo enviar ${description}:`, error.message);
    return false;
  }
}

async function sendVerification(user) {
  const token = await issueToken(user.id, 'email_verify', env.verifyTokenHours);
  return trySend(
    () =>
      mail.sendEmailVerification({
        to: user.email,
        firstName: user.first_name,
        url: link('verificar-correo.html', token),
        hours: env.verifyTokenHours,
      }),
    `la confirmación de ${user.email}`,
  );
}

export async function register(input) {
  if (await users.findUserByEmail(input.email))
    throw new HttpError(409, 'El correo ya está registrado');
  const passwordHash = await bcrypt.hash(input.password, 12);
  let user;
  try {
    user = await users.createUser({ ...input, passwordHash });
  } catch (error) {
    if (error.code === '23505') throw new HttpError(409, 'El correo ya está registrado');
    throw error;
  }
  /* No se abre sesión al registrarse: la cuenta todavía no está confirmada y
     entrar sin confirmar es justamente lo que se decidió impedir. */
  const emailSent = await sendVerification(user);
  return { user: sessionUser(user), emailSent };
}

export async function login(email, password) {
  const user = await users.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    throw new HttpError(401, 'Correo o contraseña incorrectos');

  /* La comprobación va después de la contraseña a propósito: avisar de que una
     cuenta existe pero no está confirmada antes de validar la clave revelaría
     qué correos están registrados. */
  if (!user.email_verified_at)
    throw new HttpError(
      403,
      'Todavía no has confirmado tu correo. Revisa tu bandeja de entrada y la carpeta de correo no deseado.',
      undefined,
      'email_not_verified',
    );

  return sessionUser(user);
}

/* Responde siempre igual exista o no la cuenta. Si distinguiera, cualquiera
   podría averiguar qué direcciones están registradas en una aplicación de
   salud simplemente probando correos. */
export async function requestPasswordReset(email) {
  const user = await users.findUserByEmail(email);
  if (!user) return;

  const token = await issueToken(user.id, 'password_reset', env.resetTokenHours);
  await trySend(
    () =>
      mail.sendPasswordReset({
        to: user.email,
        firstName: user.first_name,
        url: link('nueva-clave.html', token),
        hours: env.resetTokenHours,
      }),
    `el restablecimiento de ${user.email}`,
  );
}

export async function resetPassword(rawToken, newPassword) {
  const token = await users.findUsableToken(hashToken(rawToken), 'password_reset');
  if (!token)
    throw new HttpError(400, 'El enlace no es válido, ya se usó o venció. Solicita uno nuevo.');

  await users.updatePassword(token.user_id, await bcrypt.hash(newPassword, 12));
  await users.markTokenUsed(token.id);

  /* Quien abrió el enlace demostró que controla el buzón, así que la dirección
     queda confirmada de paso. Evita que alguien recupere su contraseña y siga
     sin poder entrar por no haber confirmado nunca. */
  await users.markEmailVerified(token.user_id);

  /* Y se cierran las sesiones abiertas: si el motivo del cambio fue que
     alguien más entró a la cuenta, su sesión no puede sobrevivir. */
  await users.deleteSessions(token.user_id);
}

export async function verifyEmail(rawToken) {
  const token = await users.findUsableToken(hashToken(rawToken), 'email_verify');
  if (!token)
    throw new HttpError(
      400,
      'El enlace no es válido, ya se usó o venció. Pide que te lo reenvíen.',
    );

  await users.markTokenUsed(token.id);
  await users.markEmailVerified(token.user_id);
  return { email: token.email };
}

/* Igual que la recuperación, responde siempre lo mismo. Tampoco reenvía nada a
   una cuenta ya confirmada, para no dar pistas ni gastar cuota. */
export async function resendVerification(email) {
  const user = await users.findUserByEmail(email);
  if (!user || user.email_verified_at) return;
  await sendVerification(user);
}

export async function profile(id) {
  const user = await users.findSafeUserById(id);
  if (!user) throw new HttpError(404, 'Usuario no encontrado');
  return user;
}

export const updateProfile = users.updateProfile;

export async function changePassword(id, currentPassword, newPassword) {
  const user = await users.findUserById(id);
  if (!user || !(await bcrypt.compare(currentPassword, user.password_hash))) {
    throw new HttpError(401, 'La contraseña actual es incorrecta');
  }
  if (await bcrypt.compare(newPassword, user.password_hash)) {
    throw new HttpError(400, 'La nueva contraseña debe ser diferente de la actual');
  }
  const passwordHash = await bcrypt.hash(newPassword, 12);
  const updated = await users.updatePassword(id, passwordHash);
  if (!updated) throw new HttpError(404, 'Usuario no encontrado');
}
