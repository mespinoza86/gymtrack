import 'dotenv/config';

const required = ['DATABASE_URL', 'SESSION_SECRET'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Falta la variable de entorno ${key}`);
}

if (process.env.NODE_ENV === 'production' && process.env.SESSION_SECRET.length < 32) {
  throw new Error('SESSION_SECRET debe tener al menos 32 caracteres en producción');
}

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL,
  databaseSsl: process.env.DATABASE_SSL === 'true',
  sessionSecret: process.env.SESSION_SECRET,
  appOrigin: process.env.APP_ORIGIN ?? 'http://localhost:3000',
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB ?? 5)
});
