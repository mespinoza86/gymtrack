import * as auth from '../services/auth.service.js';
import { issueCsrf } from '../middleware/csrf.js';

export async function register(req, res) {
  /* No se abre sesión: la cuenta queda pendiente de confirmar el correo. */
  const { user, emailSent } = await auth.register(req.body);
  res.status(201).json({ user, emailSent });
}

/* Los dos endpoints que envían correo responden siempre lo mismo, encuentren o
   no la cuenta, para no convertirse en un detector de correos registrados. */
const enviado = {
  message: 'Si la dirección corresponde a una cuenta, enviamos un correo con las instrucciones.',
};

export async function forgotPassword(req, res) {
  await auth.requestPasswordReset(req.body.email);
  res.json(enviado);
}

export async function resetPassword(req, res) {
  await auth.resetPassword(req.body.token, req.body.password);
  res.status(204).end();
}

export async function verifyEmail(req, res) {
  res.json(await auth.verifyEmail(req.body.token));
}

export async function resendVerification(req, res) {
  await auth.resendVerification(req.body.email);
  res.json(enviado);
}

export async function login(req, res) {
  const user = await auth.login(req.body.email, req.body.password);
  req.session.user = user;
  /* El token se entrega en la respuesta del propio acceso. Si se esperara al
     siguiente `attachCsrf`, la primera acción después de entrar se quedaría
     sin cabecera. */
  issueCsrf(req, res);
  res.json({ user });
}

export function logout(req, res, next) {
  req.session.destroy((error) => (error ? next(error) : res.status(204).end()));
}

export async function me(req, res) {
  res.json({ user: await auth.profile(req.session.user.id) });
}

export async function updateProfile(req, res) {
  const user = await auth.updateProfile(req.session.user.id, req.body);
  req.session.user = { ...req.session.user, firstName: user.first_name, lastName: user.last_name };
  res.json({ user });
}

export async function changePassword(req, res) {
  await auth.changePassword(req.session.user.id, req.body.currentPassword, req.body.newPassword);
  res.status(204).end();
}
