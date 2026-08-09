import * as auth from '../services/auth.service.js';

export async function register(req, res) {
  const user = await auth.register(req.body);
  req.session.user = user;
  res.status(201).json({ user });
}

export async function login(req, res) {
  const user = await auth.login(req.body.email, req.body.password);
  req.session.user = user;
  res.json({ user });
}

export function logout(req, res, next) {
  req.session.destroy((error) => error ? next(error) : res.status(204).end());
}

export async function me(req, res) {
  res.json({ user: await auth.profile(req.session.user.id) });
}

export async function updateProfile(req, res) {
  const user = await auth.updateProfile(req.session.user.id, req.body);
  req.session.user = { ...req.session.user, firstName: user.first_name, lastName: user.last_name };
  res.json({ user });
}
