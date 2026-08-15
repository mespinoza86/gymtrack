-- Recuperación de contraseña y confirmación de la dirección de correo.
--
-- Añade el estado de verificación a las cuentas y una tabla única de tokens
-- para los dos flujos, porque su mecánica es idéntica: se emite un valor
-- aleatorio, vence, se usa una sola vez y pertenece a un usuario.

ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ;

-- Las cuentas que ya existen se dan por verificadas. Sin esto, activar el
-- bloqueo por correo sin confirmar dejaría fuera a las personas que ya venían
-- usando la aplicación, que no tienen forma de haber recibido nunca el aviso.
UPDATE users SET email_verified_at = NOW() WHERE email_verified_at IS NULL;

CREATE TABLE IF NOT EXISTS auth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose VARCHAR(30) NOT NULL CHECK (purpose IN ('password_reset', 'email_verify')),
  -- Se guarda el SHA-256 del token, nunca el token. Una filtración de la base
  -- no debe entregar la capacidad de restablecer contraseñas ajenas.
  token_hash CHAR(64) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- La búsqueda siempre entra por el hash, y debe ser único: dos filas con el
-- mismo hash harían ambiguo a quién pertenece el token.
CREATE UNIQUE INDEX IF NOT EXISTS auth_tokens_hash_idx ON auth_tokens (token_hash);

-- Para invalidar los tokens pendientes de un usuario al emitir uno nuevo.
CREATE INDEX IF NOT EXISTS auth_tokens_pending_idx
  ON auth_tokens (user_id, purpose)
  WHERE used_at IS NULL;
