import bcrypt from 'bcryptjs';
import * as users from '../repositories/auth.repository.js';
import { HttpError } from '../utils/http-error.js';

const sessionUser = (user) => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name,
  lastName: user.last_name,
  role: user.role
});

export async function register(input) {
  if (await users.findUserByEmail(input.email)) throw new HttpError(409, 'El correo ya está registrado');
  const passwordHash = await bcrypt.hash(input.password, 12);
  try {
    return sessionUser(await users.createUser({ ...input, passwordHash }));
  } catch (error) {
    if (error.code === '23505') throw new HttpError(409, 'El correo ya está registrado');
    throw error;
  }
}

export async function login(email, password) {
  const user = await users.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) throw new HttpError(401, 'Correo o contraseña incorrectos');
  return sessionUser(user);
}

export async function profile(id) {
  const user = await users.findSafeUserById(id);
  if (!user) throw new HttpError(404, 'Usuario no encontrado');
  return user;
}

export const updateProfile = users.updateProfile;
