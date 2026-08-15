import 'dotenv/config';

const required = ['DATABASE_URL', 'SESSION_SECRET'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Falta la variable de entorno ${key}`);
}

if (process.env.NODE_ENV === 'production' && process.env.SESSION_SECRET.length < 32) {
  throw new Error('SESSION_SECRET debe tener al menos 32 caracteres en producción');
}

/* El correo NO se valida de forma que impida arrancar. Un despliegue sin
   credenciales de correo deja la aplicación en pie con el envío desactivado,
   mientras que lanzar aquí tumbaría el sitio entero por una función
   secundaria. El aviso es ruidoso a propósito para que no pase inadvertido. */
const mailTransport = process.env.MAIL_TRANSPORT ?? 'console';

if (process.env.NODE_ENV === 'production' && mailTransport === 'console') {
  console.warn(
    '[correo] MAIL_TRANSPORT no está configurado: no se enviará ningún correo. ' +
      'La recuperación de contraseña y la confirmación de cuenta no funcionarán.',
  );
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL,
  databaseSsl: process.env.DATABASE_SSL === 'true',
  sessionSecret: process.env.SESSION_SECRET,
  /* Se quita la barra final si la trae. Los enlaces de los correos se arman
     como `${appOrigin}/pagina.html`, así que un valor terminado en barra
     produciría direcciones con doble barra. Es un error fácil de cometer al
     copiar la URL desde el navegador o desde el panel de Render. */
  appOrigin: (process.env.APP_ORIGIN ?? 'http://localhost:3000').replace(/\/+$/, ''),
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB ?? 5),
  mailTransport,
  mailApiKey: process.env.MAIL_API_KEY ?? '',
  mailFrom: process.env.MAIL_FROM ?? '',
  mailFromName: process.env.MAIL_FROM_NAME ?? 'GymTrack',
  /* Vigencia de los enlaces, en horas. Una hora es lo habitual para un
     restablecimiento; la confirmación puede durar más porque no da acceso a
     nada por sí sola. */
  resetTokenHours: Number(process.env.RESET_TOKEN_HOURS ?? 1),
  verifyTokenHours: Number(process.env.VERIFY_TOKEN_HOURS ?? 24),
});
