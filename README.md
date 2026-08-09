# GymTrack

Aplicación web modular para que entrenadores asignen rutinas y planes nutricionales, y para que atletas registren entrenamientos, mediciones, check-ins y mensajes.

## Requisitos

- Node.js 20 o posterior.
- PostgreSQL instalado y en ejecución.
- npm.

## 1. Crear PostgreSQL en Windows

PostgreSQL es el programa que administra la base de datos. Una **base de datos** contiene **tablas**; cada tabla tiene columnas y filas. Las claves relacionan unas tablas con otras sin duplicar información.

Instala PostgreSQL con su herramienta gráfica pgAdmin. Durante la instalación te pedirá una contraseña para el usuario administrador `postgres`; guárdala. El puerto normal es `5432`.

Abre pgAdmin, conéctate al servidor local y abre **Query Tool** sobre la base `postgres`. Ejecuta estas instrucciones, reemplazando la contraseña:

```sql
CREATE USER gymtrack_app WITH PASSWORD 'una_clave_larga_y_privada';
CREATE DATABASE gymtrack OWNER gymtrack_app ENCODING 'UTF8';
```

También están guardadas como referencia en `database/setup.sql`. El usuario `gymtrack_app` es exclusivo para la aplicación; no conviene que Node.js utilice la cuenta administradora.

## 2. Configurar la aplicación

Instala las dependencias:

```powershell
npm.cmd install
```

Edita `.env` y coloca exactamente la misma contraseña usada al crear el usuario:

```dotenv
DATABASE_URL=postgresql://gymtrack_app:una_clave_larga_y_privada@localhost:5432/gymtrack
```

Si la contraseña contiene caracteres especiales como `@`, `:`, `/` o `#`, deben codificarse para una URL. Para comenzar, una contraseña larga con letras, números, guiones y guiones bajos evita esa dificultad.

También cambia `SESSION_SECRET` por una frase aleatoria de al menos 32 caracteres. `.env` está ignorado por Git y nunca debe publicarse.

## 3. Crear las tablas

No es necesario crear las tablas manualmente. Las migraciones son archivos SQL versionados que construyen la estructura en el orden correcto:

```powershell
npm.cmd run db:migrate
```

El comando registra cada archivo aplicado en `schema_migrations`, por lo que puede ejecutarse nuevamente sin duplicar tablas.

Para cargar cuentas y datos básicos de demostración:

```powershell
npm.cmd run db:seed
```

Las cuentas son:

- `entrenador@demo.local`
- `atleta@demo.local`
- Contraseña para ambas: `Demo1234!`

Los datos demo son únicamente para desarrollo; deben eliminarse o desactivarse antes de una publicación real.

## 4. Iniciar el servidor

Durante el desarrollo:

```powershell
npm.cmd run dev
```

Abre `http://localhost:3000`. Para ejecución normal se utiliza `npm.cmd start`.

Puedes comprobar la conexión visitando `http://localhost:3000/api/health`. Una respuesta `{"status":"ok"}` confirma que Node.js y PostgreSQL se comunican correctamente.

## Cómo inspeccionar los datos

En pgAdmin, abre `Databases > gymtrack > Schemas > public > Tables`. Haz clic derecho en una tabla y selecciona **View/Edit Data > All Rows**.

También puedes usar Query Tool:

```sql
SELECT id, email, role, created_at FROM users;
SELECT * FROM trainer_athlete_links;
SELECT * FROM routines ORDER BY created_at DESC;
SELECT * FROM measurements ORDER BY measured_at DESC;
```

No edites la estructura manualmente una vez iniciado el proyecto. Para cambiar columnas o tablas se crea una nueva migración SQL, lo que conserva un historial reproducible.

## Respaldo y restauración

En pgAdmin, haz clic derecho sobre `gymtrack` y utiliza **Backup**. El formato Custom es práctico para restaurar posteriormente mediante **Restore**. Antes de actualizar una instalación con datos reales, realiza un respaldo.

## Organización

- `public`: páginas, estilos y JavaScript descargable por el navegador.
- `src`: servidor privado de Node.js, API, permisos y acceso a PostgreSQL.
- `database/migrations`: estructura SQL versionada.
- `database/seed.js`: datos de demostración.
- `storage`: archivos privados locales durante desarrollo.
- `tests`: pruebas automatizadas.

El navegador nunca recibe la contraseña de PostgreSQL ni ejecuta SQL. Todas las solicitudes pasan por la API, sus validaciones y sus comprobaciones de permisos.

## Seguridad antes de producción

- Usar HTTPS.
- Cambiar todas las claves de desarrollo.
- Utilizar almacenamiento privado externo para fotografías y adjuntos.
- Configurar respaldos automáticos.
- Revisar las obligaciones de privacidad y datos de salud del país donde se opere.
- Retirar las cuentas demo.
- Ejecutar pruebas de autorización y recuperación ante fallos.
