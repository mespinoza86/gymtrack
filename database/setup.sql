-- Ejecuta estas instrucciones conectado como el usuario administrador "postgres".
-- Cambia la contraseña antes de ejecutar el archivo y repítela en .env.
CREATE USER gymtrack_app WITH PASSWORD 'CAMBIAR_ESTA_CLAVE';
CREATE DATABASE gymtrack OWNER gymtrack_app ENCODING 'UTF8';

-- Después de crear la base, sal de esta conexión. Las migraciones se ejecutan
-- automáticamente con: npm run db:migrate
