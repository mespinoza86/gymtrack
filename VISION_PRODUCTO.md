# Visión del producto: plataforma para entrenadores y atletas

> Documento vivo para conservar el contexto, las ideas y las decisiones del proyecto.
> Última actualización: 14 de agosto de 2026.

## Estado actual

El 7 de agosto de 2026 se construyó la primera versión funcional del MVP. Se generó una aplicación web multipágina, un servidor modular de Node.js, el modelo relacional de PostgreSQL, migraciones, datos demo y documentación de instalación.

La implementación fue revisada sintácticamente y el servidor puede importar todos sus módulos. En el equipo actual no se detectó una instalación local de PostgreSQL, por lo que las migraciones y los recorridos que requieren datos todavía deben ejecutarse después de preparar PostgreSQL y configurar la contraseña en `.env`.

## Idea general

Crear una aplicación para entrenadores de gimnasio y las personas a quienes entrenan. En este documento se utiliza **atleta** como nombre provisional para la persona que entrena, porque resulta más descriptivo y menos comercial que "cliente".

Cada persona tendrá su propia cuenta y elegirá uno de estos roles al registrarse:

- Entrenador.
- Atleta.

La plataforma permitirá que el entrenador asigne rutinas y planes de alimentación, revise los registros del atleta, lleve su progresión y mantenga comunicación directa con él.

## Vinculación entre entrenador y atleta

La propuesta actual es que el **entrenador genere un código o enlace de invitación** y se lo entregue al atleta. El atleta inicia sesión o crea su cuenta, utiliza la invitación y confirma la vinculación.

Motivos para preferir este modelo:

- El entrenador controla sus invitaciones.
- El atleta debe aceptar voluntariamente la relación.
- Se evita que un entrenador agregue personas sin autorización.
- El código puede ser de un solo uso y tener fecha de vencimiento.
- En el futuro se podría permitir que un atleta tenga más de un entrenador.

Ambas partes deberían poder terminar la relación. El atleta conservaría su historial personal aunque deje de trabajar con ese entrenador. Falta definir qué sucede con los planes y notas creados por el entrenador.

## Ciclo principal del producto

1. El entrenador planifica.
2. El atleta ejecuta y registra.
3. La aplicación organiza y muestra los datos.
4. El entrenador revisa los resultados.
5. El entrenador ajusta el plan.

La experiencia de este ciclo es más importante que agregar una gran cantidad de funciones secundarias.

## Funciones propuestas para el atleta

### Panel principal

- Entrenamiento del día.
- Comidas o metas nutricionales.
- Peso más reciente.
- Próxima medición o evaluación.
- Mensajes pendientes.
- Porcentaje de cumplimiento semanal.
- Recordatorios.

### Rutinas y entrenamientos

Una rutina podría incluir:

- Días de entrenamiento y grupos musculares.
- Ejercicios, series y repeticiones.
- Peso recomendado.
- Descanso entre series.
- RIR o RPE para expresar el esfuerzo.
- Tempo.
- Calentamiento.
- Superseries o circuitos.
- Notas del entrenador.
- Imagen, video o enlace demostrativo.

Durante cada entrenamiento el atleta podría registrar:

- Series completadas.
- Repeticiones realizadas.
- Peso utilizado.
- Esfuerzo percibido.
- Dolor o molestias.
- Comentarios para el entrenador.

Con estos datos se mostrarían la progresión por ejercicio y los récords personales.

### Alimentación

Se proponen dos modalidades compatibles:

1. Menú específico con comidas, alimentos y cantidades.
2. Objetivos flexibles de calorías, proteínas, carbohidratos, grasas, fibra y agua.

El atleta podría marcar comidas, registrar sustituciones y dejar comentarios. Se contempla agregar equivalencias de alimentos en una etapa posterior.

La plataforma debe indicar claramente que los planes nutricionales profesionales deben ser preparados por personas autorizadas de acuerdo con las reglas del país correspondiente.

### Progreso físico

- Peso y estatura.
- Porcentaje de grasa y masa muscular, cuando estén disponibles.
- Medidas de cintura, cadera, pecho, brazos, muslos y pantorrillas.
- Frecuencia cardíaca en reposo.
- Fotografías de frente, perfil y espalda.
- Gráficas y comparaciones por periodo.

Las fotografías y medidas son información privada y requerirán controles de acceso cuidadosos.

### Bienestar y recuperación

- Horas y calidad del sueño.
- Energía.
- Estrés.
- Hambre.
- Dolor muscular.
- Estado de ánimo.
- Pasos o actividad diaria.
- Adherencia al plan.
- Lesiones o molestias.

## Funciones propuestas para el entrenador

- Panel con atletas activos.
- Solicitudes de vinculación.
- Alertas por inactividad, incumplimiento o molestias reportadas.
- Entrenamientos y check-ins pendientes de revisar.
- Mensajes sin leer.
- Vista resumida de la evolución de cada atleta.
- Creación, asignación y modificación de rutinas.
- Creación y asignación de planes de alimentación.
- Consulta de medidas, fotografías, gráficas e historial.
- Retroalimentación sobre entrenamientos y check-ins.
- Evaluaciones programadas.
- Notas privadas del entrenador.
- Plantillas reutilizables de rutinas y planes.

## Comunicación

Se propone un chat directo entre entrenador y atleta con:

- Mensajes de texto.
- Imágenes y documentos.
- Estado de lectura.
- Notificaciones.
- Historial de conversación.

Además del chat general, conviene permitir comentarios asociados directamente a un ejercicio, entrenamiento, medición o check-in para conservar el contexto.

Los mensajes de voz y las videollamadas no formarían parte de la primera versión.

## Check-ins periódicos

El entrenador podría programar un formulario semanal o periódico con preguntas configurables, por ejemplo:

- Energía y recuperación.
- Porcentaje de cumplimiento.
- Dolor o molestias.
- Adherencia alimentaria.
- Dificultades de la semana.
- Peso y medidas.
- Fotografías de progreso.

El entrenador revisaría la respuesta, enviaría retroalimentación y ajustaría los planes cuando fuera necesario.

## Primera versión propuesta (MVP)

1. Registro e inicio de sesión.
2. Roles de entrenador y atleta.
3. Vinculación mediante invitación.
4. Panel del entrenador y lista de atletas.
5. Creación y asignación de rutinas.
6. Registro de entrenamientos y resultados.
7. Plan de alimentación básico.
8. Registro de peso, medidas y fotografías.
9. Gráficas de progreso.
10. Check-in semanal.
11. Chat directo.
12. Notificaciones dentro de la aplicación.

## Funciones para etapas futuras

- Calendario de citas y entrenamientos.
- Historial de lesiones y restricciones.
- Objetivos de corto y largo plazo.
- Récords personales y temporizador de descanso.
- Biblioteca de ejercicios.
- Pagos y suscripciones.
- Integraciones con relojes y aplicaciones de salud.
- Exportación de informes a PDF.
- Cuentas para gimnasios con varios entrenadores.
- Insignias o rachas con gamificación moderada.
- Consentimientos y documentos.
- Auditoría de los cambios realizados en cada plan.

## Tecnología considerada

El usuario desea utilizar JavaScript, Node.js y HTML. La propuesta inicial, todavía no definitiva, es:

- Frontend: HTML, CSS y JavaScript; posiblemente React por la cantidad de formularios, gráficas y estados interactivos.
- Backend: Node.js con Express.
- Base de datos: PostgreSQL, elegido para el proyecto por la importancia de las relaciones, la integridad y las consultas históricas.
- Chat en tiempo real: WebSockets mediante Socket.IO.
- Fotografías y archivos: almacenamiento de objetos externo y referencias en la base de datos.
- Autenticación: sesiones seguras o tokens de corta duración con renovación.
- Distribución inicial: aplicación web adaptable e instalable como PWA.

## Decisiones pendientes

- JavaScript puro o React para la interfaz.
- Si un usuario puede tener ambos roles.
- Si un atleta puede trabajar con varios entrenadores simultáneamente.
- Propiedad y visibilidad de los datos al terminar una vinculación.
- Alcance exacto del plan alimentario y consideraciones profesionales/legales.
- Funciones exactas que entrarán en el MVP.
- Modelo de negocio, pagos y límites por entrenador.
- Política de privacidad, consentimiento y protección de datos sensibles.

## Historial de conversación resumido

El usuario propuso una aplicación donde cada persona crea una cuenta como entrenador o como persona que entrena. Los entrenadores podrán asignar rutinas y dietas, llevar peso, medidas y progresión, y comunicarse directamente con sus clientes. También planteó usar códigos para conectar ambas cuentas.

Se recomendó llamar **atleta** a la persona que entrena, utilizar invitaciones generadas por el entrenador y organizar el producto alrededor del ciclo planificación, ejecución, registro, revisión y ajuste. Se añadieron como propuestas los check-ins, bienestar y recuperación, plantillas, comentarios contextuales, gráficas, fotografías, alertas y diversas funciones futuras.

El usuario solicitó guardar todo lo conversado antes de iniciar cualquier implementación y preguntó por qué se recomendó una base de datos SQL en lugar de MongoDB.

## Decisión de base de datos

Se eligió **PostgreSQL**. Los motivos principales son:

- Los usuarios, vínculos, rutinas, ejercicios, registros, mediciones y conversaciones tienen relaciones claras.
- Se necesitan reglas que protejan la integridad de los datos.
- La aplicación requerirá consultas históricas y reportes cruzados.
- PostgreSQL permite usar `JSONB` en las partes que necesiten una estructura flexible.
- Node.js funciona correctamente con PostgreSQL; utilizar JavaScript no obliga a usar MongoDB.

Las fotografías y documentos no se guardarían directamente en PostgreSQL. Se almacenarían como archivos privados o en almacenamiento de objetos, mientras PostgreSQL conservaría su ubicación, propietario, permisos y metadatos.

## Preferencia de organización del proyecto

El usuario solicita una estructura modular y fácil de entender:

- Páginas HTML separadas, por ejemplo `index.html`, `registro.html` y `rutinas.html`.
- Nada de concentrar toda la aplicación en un único archivo `index`.
- JavaScript separado por pantalla y responsabilidad.
- Código del navegador separado del código privado del servidor.
- Rutas, controladores, servicios, validaciones y consultas de base de datos en módulos distintos.

### Aclaración sobre las carpetas pública y privada

Todo archivo descargado por el navegador es técnicamente público, aunque sea JavaScript. Por esa razón, los scripts que controlan formularios y pantallas deben estar dentro de `public/js`. No deben contener contraseñas, secretos ni acceso directo a PostgreSQL.

El JavaScript realmente privado estará en `src`, fuera de `public`, y solo se ejecutará con Node.js en el servidor. Este código manejará autenticación, permisos, reglas de negocio y acceso a la base de datos.

## Diseño modular propuesto

La siguiente estructura es una propuesta previa a la implementación:

```text
gimnasio/
├── public/                         # Únicos archivos accesibles por el navegador
│   ├── index.html                  # Presentación e inicio de sesión
│   ├── registro.html               # Creación de cuenta y selección de rol
│   ├── recuperar-clave.html
│   ├── entrenador/
│   │   ├── panel.html
│   │   ├── atletas.html
│   │   ├── atleta-detalle.html
│   │   ├── invitaciones.html
│   │   ├── rutinas.html
│   │   ├── rutina-formulario.html
│   │   ├── nutricion.html
│   │   ├── checkins.html
│   │   └── mensajes.html
│   ├── atleta/
│   │   ├── panel.html
│   │   ├── entrenamiento.html
│   │   ├── historial.html
│   │   ├── nutricion.html
│   │   ├── progreso.html
│   │   ├── checkin.html
│   │   └── mensajes.html
│   ├── compartido/
│   │   ├── perfil.html
│   │   ├── configuracion.html
│   │   └── notificaciones.html
│   ├── css/
│   │   ├── base.css                # Colores, tipografía y reglas generales
│   │   ├── componentes.css         # Botones, tarjetas, tablas y formularios
│   │   ├── layout.css              # Navegación y distribución
│   │   └── paginas/                # Estilos particulares solo si son necesarios
│   ├── js/
│   │   ├── comun/
│   │   │   ├── api.js              # Cliente común para comunicarse con el servidor
│   │   │   ├── auth.js             # Estado de sesión en el navegador
│   │   │   ├── navegacion.js
│   │   │   ├── validaciones.js
│   │   │   └── utilidades.js
│   │   ├── entrenador/             # Un módulo por pantalla o función
│   │   ├── atleta/
│   │   └── compartido/
│   └── assets/
│       ├── img/
│       └── iconos/
│
├── src/                            # JavaScript privado ejecutado por Node.js
│   ├── app.js                      # Configura Express y componentes comunes
│   ├── server.js                   # Inicia el servidor
│   ├── config/
│   │   ├── entorno.js
│   │   └── base-datos.js
│   ├── routes/                     # Define las URLs de la API
│   ├── controllers/                # Recibe y responde solicitudes HTTP
│   ├── services/                   # Reglas de negocio
│   ├── repositories/               # Único nivel que consulta PostgreSQL
│   ├── validators/                 # Valida los datos recibidos
│   ├── middleware/
│   │   ├── autenticacion.js
│   │   ├── autorizacion.js
│   │   ├── errores.js
│   │   └── seguridad.js
│   ├── sockets/                    # Chat y eventos en tiempo real
│   └── utils/
│
├── database/
│   ├── migrations/                 # Cambios versionados de estructura SQL
│   ├── seeds/                      # Datos iniciales de desarrollo
│   └── docs/                       # Diagrama y explicación del modelo
│
├── storage/                        # Desarrollo local; nunca se publica directamente
│   ├── progreso/
│   └── adjuntos/
│
├── tests/
│   ├── unitarios/
│   ├── integracion/
│   └── api/
│
├── .env.example                   # Nombres de variables, nunca secretos reales
├── .gitignore
├── package.json
├── README.md
└── VISION_PRODUCTO.md
```

Los directorios se crearán conforme sean necesarios; no hace falta generar archivos vacíos para todas las funciones futuras.

## Separación interna del backend

Cada área funcional será un módulo. Por ejemplo, el módulo de rutinas se distribuirá así:

```text
routes/rutinas.routes.js
        ↓
controllers/rutinas.controller.js
        ↓
services/rutinas.service.js
        ↓
repositories/rutinas.repository.js
        ↓
PostgreSQL
```

- **Ruta:** reconoce la URL y aplica autenticación y validación.
- **Controlador:** interpreta la solicitud y construye la respuesta.
- **Servicio:** aplica las reglas del producto y los permisos.
- **Repositorio:** contiene las consultas SQL y nada de interfaz.

Se seguirá el mismo patrón para autenticación, usuarios, vinculaciones, rutinas, nutrición, mediciones, check-ins, mensajes y notificaciones. Esto impide que el SQL, las reglas y las respuestas HTTP terminen mezclados.

## Módulos funcionales previstos

1. **Autenticación y cuentas:** registro, acceso, recuperación de contraseña, sesiones y roles.
2. **Perfiles:** información personal, preferencias y configuración.
3. **Vinculaciones:** invitaciones, aceptación, rechazo y finalización de la relación.
4. **Atletas:** listado, ficha individual y permisos del entrenador.
5. **Rutinas:** plantillas, asignaciones, días, ejercicios y progresión.
6. **Entrenamientos:** ejecución, series, resultados, esfuerzo y molestias.
7. **Nutrición:** planes, comidas, objetivos y cumplimiento.
8. **Progreso:** peso, medidas, fotografías y gráficas.
9. **Check-ins:** formularios programados, respuestas y revisión.
10. **Mensajería:** conversaciones, mensajes, adjuntos y lectura.
11. **Notificaciones:** avisos dentro de la aplicación y preferencias.
12. **Administración futura:** soporte, auditoría y gestión de la plataforma.

## Modelo inicial de PostgreSQL

El diseño exacto se validará antes de escribir migraciones, pero estas son las áreas de tablas previstas:

- Identidad: `usuarios`, `roles`, `usuarios_roles`, `sesiones`.
- Relación profesional: `vinculaciones`, `invitaciones`.
- Entrenamiento: `ejercicios`, `rutinas`, `rutina_dias`, `rutina_ejercicios`, `series_planificadas`, `sesiones_entrenamiento`, `series_realizadas`.
- Nutrición: `planes_nutricionales`, `comidas`, `alimentos_plan`, `registros_comida`.
- Progreso: `mediciones`, `fotos_progreso`, `objetivos`.
- Seguimiento: `plantillas_checkin`, `checkins`, `respuestas_checkin`.
- Comunicación: `conversaciones`, `participantes_conversacion`, `mensajes`, `adjuntos`.
- Sistema: `notificaciones`, `auditoria`.

No se guardarán listas complejas en una sola celda cuando deban consultarse o relacionarse. Por ejemplo, las series realizadas tendrán registros separados para poder analizar la progresión.

## Contrato entre las páginas y el servidor

Las páginas nunca se conectarán directamente con PostgreSQL. El flujo será:

```text
HTML + JavaScript público
        ↓ petición HTTPS / JSON
API privada de Node.js
        ↓ validación y permisos
Servicios y repositorios
        ↓ consulta parametrizada
PostgreSQL
```

La API se dividirá por recursos, por ejemplo:

```text
/api/auth
/api/usuarios
/api/vinculaciones
/api/rutinas
/api/entrenamientos
/api/nutricion
/api/mediciones
/api/checkins
/api/conversaciones
/api/notificaciones
```

## Fases propuestas de construcción

### Fase 0: diseño y preparación

- Confirmar alcance del MVP.
- Crear diagrama de navegación.
- Diseñar el modelo relacional y sus permisos.
- Definir apariencia básica y componentes compartidos.
- Preparar PostgreSQL y variables de entorno.

### Fase 1: base segura

- Estructura modular del proyecto.
- Conexión con PostgreSQL y migraciones.
- Registro, inicio y cierre de sesión.
- Roles, autorización y perfiles.
- Pruebas básicas de autenticación.

### Fase 2: relación entrenador-atleta

- Invitaciones de un solo uso.
- Aceptación y gestión de vinculaciones.
- Panel del entrenador y panel del atleta.

### Fase 3: entrenamiento

- Biblioteca de ejercicios.
- Creación de rutinas y plantillas.
- Asignación al atleta.
- Registro de entrenamientos, series y progresión.

### Fase 4: nutrición y progreso

- Planes alimentarios.
- Peso, medidas, objetivos y fotografías.
- Gráficas e historial.

### Fase 5: seguimiento y comunicación

- Check-ins.
- Chat en tiempo real.
- Comentarios contextuales y notificaciones.

### Fase 6: endurecimiento y entrega

- Revisión de permisos y privacidad.
- Pruebas integrales.
- Accesibilidad y adaptación móvil.
- Respaldo, despliegue y documentación de uso.

## Forma prevista de enseñar PostgreSQL

Cuando comience la implementación, se explicará la base de datos paso a paso y sin asumir experiencia previa:

1. Qué es PostgreSQL, una base de datos, una tabla, una fila y una columna.
2. Cómo instalar PostgreSQL o utilizar una instancia administrada.
3. Cómo crear la base de datos y un usuario exclusivo de la aplicación.
4. Cómo configurar la conexión mediante variables de entorno.
5. Cómo ejecutar migraciones en vez de modificar tablas manualmente sin historial.
6. Cómo inspeccionar tablas y datos con una interfaz gráfica o con `psql`.
7. Cómo realizar respaldos y restauraciones.
8. Cómo proteger credenciales y evitar publicar el archivo `.env`.

El repositorio incluirá instrucciones reproducibles para crear la estructura. No será necesario copiar manualmente cada tabla cada vez que se instale el proyecto.

## Nueva decisión y solicitud registrada

El usuario confirmó PostgreSQL, pidió trabajar posteriormente en toda la aplicación y solicitó una explicación para principiantes sobre cómo crear y administrar la base de datos. Antes de implementar, pidió este diseño modular y reiteró que todo lo acordado debe continuar guardándose en este documento.

## Implementación del MVP realizada

### Infraestructura

- Proyecto Node.js configurado con módulos ES.
- Express 5 y servidor HTTP.
- PostgreSQL mediante un pool de conexiones.
- Migraciones SQL ordenadas y registradas en `schema_migrations`.
- Script para datos de demostración.
- Variables de entorno mediante `.env` y plantilla `.env.example`.
- Sesiones persistidas en PostgreSQL.
- Socket.IO para actualizaciones del chat.
- Helmet, límites de solicitudes de autenticación y validación con Zod.
- Contraseñas protegidas con bcrypt.
- Cierre ordenado del servidor y del pool de conexiones.

### Base de datos implementada

Se crearon migraciones para:

- Usuarios y roles.
- Sesiones de acceso.
- Invitaciones y vinculaciones.
- Ejercicios, rutinas, días y ejercicios asignados.
- Sesiones de entrenamiento y series realizadas.
- Planes nutricionales y comidas.
- Mediciones corporales.
- Metadatos para fotografías de progreso.
- Check-ins y retroalimentación.
- Conversaciones y mensajes.
- Notificaciones y auditoría como estructura preparada para ampliación.
- Índices y actualización automática de fechas de modificación.

### API implementada

- Registro, inicio y cierre de sesión.
- Consulta y modificación del perfil.
- Generación y aceptación de invitaciones.
- Listado de entrenadores o atletas vinculados.
- Catálogo de ejercicios.
- Creación, asignación y consulta de rutinas.
- Inicio y finalización de entrenamientos con registro de series.
- Historial y volumen de entrenamiento.
- Creación y consulta de planes nutricionales.
- Registro y consulta de medidas.
- Envío, consulta y revisión de check-ins.
- Conversaciones, mensajes y eventos de chat en tiempo real.
- Comprobación de salud de la conexión a PostgreSQL.

### Interfaz implementada

La interfaz utiliza HTML multipágina y JavaScript modular, de acuerdo con la preferencia del usuario.

Páginas públicas:

- Inicio de sesión.
- Registro y selección de rol.

Área del entrenador:

- Panel.
- Atletas.
- Invitaciones.
- Rutinas y formulario para crear una rutina.
- Planes nutricionales.
- Revisión de check-ins.

Área del atleta:

- Panel.
- Rutinas y registro de las series realizadas.
- Historial de entrenamientos.
- Plan nutricional.
- Mediciones y progreso.
- Check-in semanal.

Área compartida:

- Perfil y vinculación mediante código.
- Mensajería en tiempo real.

### Archivos de ayuda

- `README.md` explica la instalación de PostgreSQL para principiantes.
- `database/setup.sql` contiene la creación inicial del usuario y la base.
- `.env.example` documenta toda la configuración requerida.
- `database/seed.js` crea cuentas demo vinculadas.

### Dependencias y verificaciones

- Se instalaron 132 paquetes transitivos mediante npm.
- `npm audit` reportó cero vulnerabilidades conocidas en el momento de la instalación.
- Se revisó la sintaxis de 52 archivos JavaScript sin encontrar errores.
- La aplicación y su configuración de rutas pudieron importarse correctamente.
- `npm test` se ejecutó correctamente, aunque aún no existen pruebas automatizadas sustantivas.

## Límites conscientes de esta primera versión

La primera versión implementa el ciclo esencial, pero no debe considerarse lista para producción sin completar estas tareas:

- Instalar PostgreSQL, ejecutar las migraciones y hacer pruebas integrales con datos reales.
- Agregar carga y acceso privado de fotografías y adjuntos. La estructura de tabla ya existe, pero no se expuso todavía una interfaz de archivos para evitar publicar fotografías de forma insegura.
- Conectar la tabla de notificaciones a eventos de negocio y crear su interfaz.
- Agregar recuperación y verificación de correo electrónico.
- Permitir rutinas de varios días desde una interfaz más avanzada. La API ya acepta varios días; el primer formulario visual crea un día por rutina.
- Añadir edición, archivado y duplicación de rutinas y planes.
- Añadir formularios para que el entrenador registre medidas desde la ficha del atleta.
- Crear pruebas automatizadas de API, permisos, transacciones y recorridos completos.
- Agregar protección CSRF explícita, política de retención, consentimiento y controles operativos requeridos para producción.
- Definir el proveedor de almacenamiento, correo y despliegue.

Estas limitaciones se documentan para no confundir un MVP ejecutable con un sistema ya preparado para manejar datos reales de salud en producción.

## Guía de puesta en marcha de PostgreSQL

Se indicó al usuario un procedimiento para principiantes en Windows:

1. Descargar el instalador estable oficial de PostgreSQL para Windows, que incluye PostgreSQL Server y pgAdmin.
2. Instalar el servidor conservando el puerto predeterminado `5432` y guardar de forma segura la contraseña administrativa del usuario `postgres`.
3. Abrir pgAdmin y conectarse al servidor local.
4. Crear un usuario exclusivo `gymtrack_app` y una base `gymtrack` cuyo propietario sea ese usuario.
5. Colocar la misma contraseña en `DATABASE_URL` dentro de `.env` y cambiar `SESSION_SECRET`.
6. Ejecutar `npm.cmd run db:migrate` para crear todas las tablas.
7. Ejecutar opcionalmente `npm.cmd run db:seed` para cargar las cuentas demo.
8. Iniciar la aplicación con `npm.cmd run dev` y verificar `/api/health`.

La explicación ampliada y los comandos correspondientes también se conservan en `README.md` y `database/setup.sql`.

## Punto de continuación para la próxima sesión

El usuario tuvo que retirarse y **no realizó todavía ningún paso relacionado con PostgreSQL**. No se debe asumir que PostgreSQL está instalado, que existe la base de datos ni que `.env` está configurado.

En la próxima sesión se continuará desde cero y de manera guiada, esperando confirmación después de cada etapa:

1. Comprobar si PostgreSQL ya está instalado en Windows.
2. Si no está instalado, descargar una versión estable desde la página oficial.
3. Acompañar al usuario pantalla por pantalla durante la instalación.
4. Explicar y guardar la contraseña administrativa del usuario `postgres`.
5. Abrir pgAdmin y comprobar la conexión al servidor local.
6. Crear el usuario de aplicación `gymtrack_app` con una contraseña nueva.
7. Crear la base de datos `gymtrack` y asignar `gymtrack_app` como propietario.
8. Modificar `DATABASE_URL` y `SESSION_SECRET` dentro de `.env` sin exponer las contraseñas en la conversación.
9. Ejecutar `npm.cmd run db:migrate` y resolver cualquier error antes de continuar.
10. Inspeccionar en pgAdmin las tablas creadas y explicar visualmente filas, columnas, claves y relaciones.
11. Ejecutar `npm.cmd run db:seed` para crear las cuentas de demostración.
12. Iniciar el servidor con `npm.cmd run dev`.
13. Verificar `http://localhost:3000/api/health` y después probar ambas cuentas demo.
14. Explicar cómo detener y volver a iniciar PostgreSQL y la aplicación en sesiones futuras.

La asistencia debe ser apta para una persona sin experiencia previa en SQL: dar un paso a la vez, explicar qué hace y comprobar el resultado antes de pasar al siguiente. El usuario no pudo avanzar hoy, por lo que la próxima sesión debe comenzar en el paso 1, no en las migraciones.

## Continuación del 8 de agosto de 2026

Se retomó la preparación local de PostgreSQL paso a paso. Primero se comprobó que el equipo todavía no tenía disponible `psql` ni un servicio de PostgreSQL. Se descargó e instaló PostgreSQL para Windows junto con pgAdmin 4.

Durante el primer intento, Windows Smart App Control bloqueó la ejecución de pgAdmin. Se recomendó no desactivar permanentemente esa protección sin comprobar antes la instalación. El usuario resolvió el bloqueo y completó la instalación.

Se verificó desde PowerShell lo siguiente:

- PostgreSQL 18.4 está instalado en `C:\Program Files\PostgreSQL\18`.
- El servicio `postgresql-x64-18` está registrado y en ejecución.
- La herramienta `psql` responde correctamente e informa la versión 18.4.
- pgAdmin 4 abre correctamente y permite conectarse al servidor `PostgreSQL 18`.

Desde Query Tool de pgAdmin, conectado a la base administrativa `postgres`, el usuario realizó correctamente estas tareas:

1. Creó el usuario exclusivo de la aplicación `gymtrack_app`; pgAdmin confirmó la operación con `CREATE ROLE`.
2. Creó la base de datos `gymtrack`, codificada en UTF-8 y con `gymtrack_app` como propietario; pgAdmin confirmó la operación con `CREATE DATABASE`.
3. Actualizó el archivo `.env` con `DATABASE_URL`, un `SESSION_SECRET` privado y la configuración local requerida.

No se guardó ninguna contraseña en este documento ni en la conversación.

Después de configurar `.env`, se ejecutó `npm.cmd run db:migrate` correctamente. Se aplicaron `001_initial_schema.sql` y `002_seed_exercises.sql`, y el sistema informó `Migraciones al día`. El siguiente paso es verificar las tablas creadas, cargar los datos de demostración y probar la aplicación.

Seguidamente se ejecutó `npm.cmd run db:seed` y la carga terminó correctamente con el mensaje `Datos demo listos`. Quedaron preparadas las cuentas de demostración del entrenador y del atleta, su vinculación activa y una conversación compartida. El próximo paso es iniciar el servidor y comprobar `/api/health` y el acceso desde el navegador.

El servidor se inició con `npm.cmd run dev` y la comprobación `http://localhost:3000/api/health` respondió `{"status":"ok"}`. Esto confirma que el servidor Node.js está funcionando y puede consultar PostgreSQL con la configuración actual. Falta validar visualmente los recorridos de las cuentas demo y las funciones principales del MVP.

## Punto de continuación después del 8 de agosto de 2026

El usuario tuvo que retirarse justo después de confirmar que `/api/health` responde correctamente. La preparación técnica de PostgreSQL ya terminó y no debe repetirse en la próxima sesión.

Estado confirmado al cerrar la sesión:

- PostgreSQL 18.4 está instalado.
- El servicio de Windows `postgresql-x64-18` está en ejecución.
- pgAdmin 4 abre y se conecta al servidor local.
- Existe el usuario de aplicación `gymtrack_app`.
- Existe la base de datos `gymtrack` y su propietario es `gymtrack_app`.
- El archivo `.env` está configurado con credenciales privadas y un secreto de sesión.
- Las migraciones `001_initial_schema.sql` y `002_seed_exercises.sql` se aplicaron correctamente.
- `npm.cmd run db:seed` cargó las cuentas demo, su vinculación y la conversación inicial.
- `npm.cmd run dev` inicia el servidor.
- `http://localhost:3000/api/health` respondió `{"status":"ok"}`.

La próxima sesión debe comenzar en la validación funcional desde el navegador:

1. Abrir una terminal en la carpeta del proyecto y ejecutar `npm.cmd run dev` si el servidor no sigue activo.
2. Abrir `http://localhost:3000`.
3. Iniciar sesión como entrenador con `entrenador@demo.local` y la contraseña demo documentada en `README.md`.
4. Confirmar que el panel muestre un atleta activo y recorrer atletas, invitaciones, rutinas, nutrición, check-ins y mensajes.
5. Cerrar sesión e ingresar como `atleta@demo.local`.
6. Revisar el panel, rutinas, historial, nutrición, progreso, check-in y mensajes.
7. Probar un recorrido entrenador-atleta completo: crear una invitación o utilizar la vinculación demo, asignar una rutina, registrarla como atleta y revisar el resultado.
8. Probar planes nutricionales, mediciones, check-ins y chat entre dos sesiones de navegador.
9. Registrar y corregir cualquier error funcional encontrado.
10. Antes de considerar el MVP listo para datos reales, atender las tareas de seguridad y calidad ya documentadas: pruebas automatizadas, autorización estricta de entrenamientos, prevención de XSS y CSRF, transacciones completas y almacenamiento privado de archivos.

No se guardaron contraseñas privadas en este documento. Las credenciales demo continúan documentadas en `README.md` y son exclusivamente para desarrollo local.

## Acuerdo de documentación continua

A partir del 8 de agosto de 2026, `vision_producto.md` será también la bitácora principal del proyecto. Cada tarea realizada se documentará aquí durante la misma sesión, incluyendo:

- La solicitud o el objetivo trabajado.
- Las decisiones tomadas y sus motivos relevantes.
- Los archivos o áreas modificadas.
- Las comprobaciones y pruebas ejecutadas, junto con su resultado.
- Los errores encontrados, las correcciones aplicadas y cualquier pendiente.
- El punto exacto desde el que debe continuar la siguiente sesión.

No se incluirán contraseñas, secretos, tokens ni otros datos privados. Los cambios futuros no se considerarán completamente entregados hasta que su resultado también quede registrado en este documento.

## Procedimiento de arranque diario

El 8 de agosto de 2026 se comprobó nuevamente el arranque local. El servicio de Windows `postgresql-x64-18` estaba en estado `Running` y configurado con inicio `Automatic`, por lo que PostgreSQL normalmente se levanta al encender el equipo y no es necesario abrir pgAdmin.

Para iniciar la aplicación durante el desarrollo:

1. Abrir PowerShell en la carpeta raíz del proyecto.
2. Comprobar, solo si existe algún problema de conexión, el servicio con `Get-Service postgresql-x64-18`.
3. Si el servicio estuviera detenido, abrir PowerShell como administrador y ejecutar `Start-Service postgresql-x64-18`.
4. Ejecutar `npm.cmd run dev` y mantener esa terminal abierta.
5. Abrir `http://localhost:3000` en el navegador.
6. Comprobar opcionalmente `http://localhost:3000/api/health`; `{"status":"ok"}` confirma la comunicación entre Node.js y PostgreSQL.
7. Para detener el servidor Node.js, regresar a la terminal y pulsar `Ctrl + C`. PostgreSQL puede permanecer en ejecución como servicio de Windows.

Las migraciones y los datos demo ya están cargados. No se deben ejecutar `npm.cmd run db:migrate` ni `npm.cmd run db:seed` como parte del arranque normal; las migraciones solo se ejecutan cuando haya cambios nuevos en la estructura y el seed podría restablecer o alterar datos de demostración.

## Plan inicial de despliegue en Render

El 8 de agosto de 2026 se revisó la compatibilidad del proyecto con Render. La aplicación se desplegará como un **Web Service de Node.js** y utilizará una instancia separada de **Render Postgres**. La base local de Windows no se copia ni queda conectada al sitio público: en Render se crea una base nueva y se aplican las migraciones del proyecto.

Compatibilidad confirmada en el código actual:

- El servidor utiliza la variable `PORT` proporcionada por la plataforma.
- `NODE_ENV=production` activa cookies de sesión seguras y la confianza en el proxy de Render.
- `DATABASE_URL` permite conectar la base administrada.
- `DATABASE_SSL=true` habilita TLS para PostgreSQL.
- `APP_ORIGIN` permite configurar la URL pública `https://...onrender.com`.
- `.env` y `node_modules` están excluidos mediante `.gitignore` y no deben subirse a GitHub.

Flujo propuesto:

1. Convertir la carpeta en un repositorio Git y publicarlo, preferiblemente como repositorio privado de GitHub.
2. Crear una base de datos Render Postgres y escoger la misma región que el servicio web.
3. Crear el Web Service desde el repositorio, con `npm install` como comando de construcción y `npm start` como comando de inicio.
4. Configurar `NODE_ENV=production`, `DATABASE_URL` con la URL interna de Render, `DATABASE_SSL=true`, un `SESSION_SECRET` nuevo y `APP_ORIGIN` con la URL pública definitiva.
5. Configurar `/api/health` como ruta de comprobación de salud.
6. Ejecutar `npm run db:migrate` contra la base de Render antes de usar la aplicación. En servicios de pago puede utilizarse el comando previo al despliegue; para una primera prueba gratuita deberá elegirse un mecanismo compatible con el plan disponible.
7. No ejecutar el seed demo en producción salvo que se decida crear expresamente un entorno público de demostración.
8. Probar registro, inicio de sesión, sesiones, WebSockets y los recorridos principales después del despliegue.

Antes de publicar datos reales sigue pendiente el endurecimiento de seguridad y calidad registrado anteriormente. También debe recordarse que el sistema de archivos normal de Render es efímero; las futuras fotografías y adjuntos necesitarán almacenamiento de objetos o almacenamiento persistente, no una carpeta local del servicio.

## Inicio efectivo del despliegue

El 8 de agosto de 2026 el usuario publicó el proyecto en GitHub. Se comprobó localmente lo siguiente:

- El repositorio utiliza la rama `main`.
- El remoto `origin` apunta a `https://github.com/mespinoza86/gymtrack.git`.
- El primer commit existe con el identificador corto `80c9b32`.
- `.env` no está rastreado ni fue incluido en el repositorio.
- `.env.example` sí está rastreado, como plantilla sin secretos.

El siguiente paso acordado es crear Render Postgres. Para reducir errores, primero se terminará la base administrada y después se creará el Web Service en la misma región.

## Revisión del proveedor gratuito de base de datos

El 8 de agosto de 2026 se detectó que Render Postgres gratuito vence 30 días después de su creación. La documentación vigente de Render indica que la base queda inaccesible al vencer, ofrece 14 días para actualizarla voluntariamente y después elimina los datos; el vencimiento no constituye por sí solo una autorización para comenzar a cobrar.

Se evaluó cambiar a MongoDB Atlas. Atlas ofrece un clúster gratuito M0 sin fecha de vencimiento, con 512 MB de almacenamiento y límites propios; además, pausa los clústeres sin conexiones después de 30 días de inactividad. Sin embargo, el proyecto actual está construido específicamente sobre PostgreSQL: esquema relacional, migraciones SQL, consultas de todos los repositorios, transacciones, restricciones y sesiones mediante `connect-pg-simple`. Migrar a MongoDB obligaría a rediseñar el modelo y reescribir y volver a probar una parte sustancial del backend. No se recomienda asumir ese coste técnico únicamente por el proveedor de alojamiento.

La alternativa recomendada para esta etapa es mantener PostgreSQL y utilizar el plan gratuito de Neon, que actualmente anuncia cero dólares, sin límite de tiempo ni tarjeta, 0.5 GB de almacenamiento y 100 CU-horas mensuales por proyecto, con suspensión automática del cómputo cuando queda inactivo. El Web Service puede permanecer en Render y conectarse a Neon mediante `DATABASE_URL` y `DATABASE_SSL=true`.

Esta recomendación es apropiada para desarrollo, demostraciones y pruebas con pocos usuarios. Ningún plan gratuito debe tratarse como infraestructura definitiva para datos reales sensibles sin revisar respaldos, disponibilidad, límites, privacidad y costes de producción.

## Continuación del 9 de agosto de 2026

Al iniciar la sesión se revisó completamente este documento y el estado local del repositorio para recuperar el contexto sin repetir trabajo ya terminado. Se confirmó que la instalación local de PostgreSQL, las migraciones, los datos demo, el servidor y la comprobación `/api/health` ya habían quedado funcionando. También se confirmó que el proyecto ya está publicado en GitHub y que existe un cambio local pendiente en este mismo documento con las decisiones tomadas al cierre del 8 de agosto.

El punto exacto de continuación es el despliegue gratuito: se mantiene PostgreSQL y, según la última decisión, se utilizará **Neon** para alojar la base de datos y **Render** para ejecutar el servicio web. Por tanto, el siguiente paso es crear el proyecto y la base PostgreSQL en Neon, obtener de forma privada su cadena de conexión y después aplicar allí las migraciones. No se publicarán contraseñas ni cadenas de conexión en esta bitácora, en GitHub ni en la conversación.

Se renovó el acuerdo de documentación continua: toda decisión, cambio de archivos, comando importante, prueba, error, corrección y pendiente de esta sesión se agregará a `VISION_PRODUCTO.md` conforme avancemos. El trabajo de hoy no se considerará cerrado hasta dejar documentado el punto exacto de continuación.

### Inicio de la creación de la base en Neon

Se comenzó la guía paso a paso para crear una cuenta gratuita de Neon y alojar una nueva base PostgreSQL para el despliegue. Se verificó en la información oficial vigente de Neon que el plan Free cuesta $0, no requiere tarjeta y no tiene límite de tiempo. Neon crea automáticamente una base PostgreSQL al crear un proyecto.

La primera etapa indicada al usuario es registrarse en la consola de Neon, preferiblemente mediante su cuenta de GitHub para simplificar el acceso al proyecto ya publicado. La configuración prevista para el proyecto es usar `gymtrack` como nombre del proyecto y de la base de datos, una versión estable de PostgreSQL ofrecida por Neon y una región que resulte adecuada para el futuro servicio de Render. Todavía no se ha confirmado que la cuenta o el proyecto hayan sido creados.

Por seguridad, la contraseña y la cadena `DATABASE_URL` generadas por Neon no deben copiarse en esta bitácora, en el chat ni en GitHub. Se guardarán únicamente en los administradores de variables privadas correspondientes cuando llegue la etapa de conexión.

El usuario completó la creación de su cuenta y llegó correctamente al formulario `Welcome to Neon` para crear el primer proyecto. Se acordó configurar `gymtrack` como nombre del proyecto, PostgreSQL 18 y la región `AWS US East 2 (Ohio)`. Esta región se eligió porque Render también permite desplegar el futuro Web Service en Ohio, reduciendo la distancia entre la aplicación y la base de datos. PostgreSQL 18 coincide además con la versión utilizada localmente.

La opción **Neon Auth** se mantendrá desactivada, ya que GymTrack ya implementa autenticación, sesiones, roles y usuarios en su propio backend. Activar un segundo sistema de autenticación en esta etapa duplicaría responsabilidades y no forma parte del diseño actual. El proyecto de Neon todavía está pendiente de crearse y confirmarse.

El usuario creó correctamente el proyecto `gymtrack` en Neon. Desde el panel se confirmó que pertenece al plan Free, utiliza la rama predeterminada `production`, tiene el cómputo primario activo y está alojado en `AWS US East 2 (Ohio)`. La captura revisada no mostró contraseñas ni cadenas de conexión. El siguiente paso es comprobar el nombre de la base PostgreSQL creada automáticamente y, si conserva el nombre predeterminado `neondb`, crear o seleccionar la base definitiva `gymtrack` antes de obtener credenciales y ejecutar migraciones.

Se comprobó que Neon creó la base predeterminada `neondb` con el rol propietario `neondb_owner`. Se decidió conservarla intacta y crear una base adicional llamada `gymtrack`, usando `neondb_owner` como propietario. Esto permite que el nombre de la base desplegada coincida con el proyecto y evita realizar una eliminación innecesaria de la base predeterminada. La creación de `gymtrack` está pendiente de confirmación.

El usuario confirmó que la base `gymtrack` ya aparece en Neon, por lo que su creación terminó correctamente. Se revisó la configuración del proyecto local: la aplicación lee `DATABASE_URL` y `DATABASE_SSL` desde el entorno, y `.env` está excluido por `.gitignore`. Como `.env` contiene actualmente la conexión a PostgreSQL local, no se reemplazará con la conexión de Neon. La cadena privada de Neon se utilizará temporalmente para las migraciones y posteriormente se almacenará directamente como variable secreta del Web Service en Render.

Se abrió correctamente el diálogo de conexión de Neon y se verificaron la rama `production`, la base `gymtrack`, el rol `neondb_owner` y el cómputo primario activo. La opción `Connection pooling` aparece habilitada y se mantendrá así para la conexión del servicio alojado en Render. La captura compartida ocultó la contraseña y no expuso la cadena completa. No fue necesario copiar ni almacenar todavía la conexión; podrá recuperarse desde el botón `Connect` cuando se configuren las variables privadas de Render.

## Continuación del 9 de agosto de 2026: nueva sesión

Al comenzar esta sesión, el usuario pidió recuperar todo el contexto del proyecto y mantener este documento como bitácora viva de absolutamente todo lo trabajado durante el día. Se leyó nuevamente `VISION_PRODUCTO.md`, se revisó el estado de Git y se confirmó que el único cambio local pendiente corresponde a las anotaciones de despliegue agregadas a este mismo documento. No se modificó ni descartó ese trabajo previo.

El punto exacto heredado de la sesión anterior es el siguiente:

- El proyecto `gymtrack` ya existe en Neon, en el plan Free y en `AWS US East 2 (Ohio)`.
- La rama de Neon es `production` y la base definitiva `gymtrack` ya fue creada.
- El rol propietario es `neondb_owner` y la conexión agrupada mediante *pooling* quedó seleccionada.
- La cadena privada de conexión todavía no se ha aplicado a las migraciones ni se ha guardado en Render.
- La conexión local conservada en `.env` no debe reemplazarse, para poder seguir usando PostgreSQL local normalmente.

Por tanto, lo siguiente es aplicar a Neon las migraciones SQL que ya funcionan localmente. Para hacerlo se obtendrá la cadena de conexión de la base `gymtrack` desde el diálogo `Connect` de Neon y se proporcionará al proceso de migración únicamente como variable temporal y secreta. La cadena no se copiará en este documento, no se incorporará a comandos que queden documentados con su valor, no se guardará en Git y no sustituirá el contenido de `.env`.

Después de ejecutar `npm.cmd run db:migrate` contra Neon, se deberá confirmar el mensaje `Migraciones al día` y verificar desde Neon que existen las tablas y el registro de migraciones. Si esa comprobación termina correctamente, el paso posterior será crear en Render el Web Service de Node.js conectado al repositorio de GitHub, escoger también la región de Ohio y configurar allí las variables privadas de producción. Los datos demo no se cargarán en Neon salvo que el usuario decida expresamente que este primer despliegue será un entorno público de demostración.

### Primer error de arranque en Render

El usuario avanzó hasta crear y desplegar el Web Service en Render. La descarga del repositorio, la instalación de dependencias y la compilación finalizaron correctamente, pero el proceso `node src/server.js` se detuvo durante el arranque con el mensaje `SESSION_SECRET debe tener al menos 32 caracteres en producción`.

Se inspeccionó `src/config/environment.js` y se confirmó que la aplicación exige correctamente la presencia de `DATABASE_URL` y `SESSION_SECRET`, y que en producción valida que el secreto de sesión tenga al menos 32 caracteres. Como Render superó la comprobación de existencia pero no la de longitud, el proceso sí recibió `SESSION_SECRET`, aunque con menos de 32 caracteres. El valor que el usuario había intentado configurar incluía varios signos de dólar; esos caracteres pueden introducir ambigüedad al importar o interpretar configuraciones con sintaxis de entorno. No es necesario relajar la validación ni modificar el código de seguridad.

Además, el valor anterior quedó expuesto en la conversación y debe considerarse comprometido. Se decidió rotarlo inmediatamente y no volver a utilizarlo. La corrección acordada es generar un secreto aleatorio nuevo de 64 caracteres hexadecimales, sin espacios, comillas, signos de dólar ni el prefijo `SESSION_SECRET=`, introducir únicamente el valor en el campo correspondiente de Render y elegir `Save and deploy`. El secreto nuevo no debe compartirse en capturas, conversación, GitHub ni esta bitácora.

Después del nuevo despliegue se comprobará si el servidor supera esta validación. Si aparece otro error, se analizará por separado; el mensaje del repositorio de GitHub y la versión de Node mostrados antes de este fallo no fueron la causa de esta interrupción concreta.

El usuario confirmó que, después de reemplazar `SESSION_SECRET` por el nuevo valor seguro y volver a desplegar, Render arrancó correctamente. El error de longitud del secreto quedó resuelto. El valor nuevo no se compartió ni se registró en este documento.

### Visibilidad y confirmación de contraseñas

El usuario solicitó poder mostrar u ocultar la contraseña mediante un icono de ojo junto a todos los campos correspondientes. También pidió que el formulario de creación de cuenta tuviera dos campos, `Nueva contraseña` y `Confirmar contraseña`, ambos con su propio icono, y que se comprobara que sus valores coincidieran.

Se implementaron los siguientes cambios:

- Se creó `public/js/comun/password-toggle.js`, un componente reutilizable que detecta los campos de contraseña de la pantalla, agrega a cada uno un botón independiente y alterna entre contraseña oculta y texto visible.
- El botón cambia entre los estados mostrar y ocultar, conserva el foco en el campo y expone etiquetas y estado mediante `aria-label`, `aria-pressed` y `title` para mejorar su accesibilidad.
- `public/js/auth/login.js` inicializa el componente en el formulario de inicio de sesión.
- `public/registro.html` ahora presenta los campos `Nueva contraseña` y `Confirmar contraseña`, con atributos `autocomplete` apropiados.
- `public/js/auth/registro.js` comprueba en el navegador que ambos valores coincidan antes de llamar a la API. Si son diferentes, detiene el envío, muestra `Las contraseñas no coinciden.` y lleva el foco al campo de confirmación. El valor de confirmación se elimina de los datos antes de enviarlos al servidor.
- `public/css/components.css` incorpora la distribución, los estados de interacción y los iconos SVG de los botones, sin depender de imágenes ni bibliotecas externas.

Se confirmó que los únicos campos de contraseña existentes actualmente están en inicio de sesión y creación de cuenta, por lo que ambos recorridos quedaron cubiertos. Se ejecutó la comprobación sintáctica de los tres módulos JavaScript modificados o creados y todos fueron válidos. También se ejecutó `npm.cmd test`: el comando terminó correctamente, aunque el proyecto todavía informa 0 pruebas automatizadas, por lo que queda pendiente incorporar cobertura real para estos formularios.

### Revisión de la función para cambiar la contraseña

El usuario preguntó si la aplicación ya ofrecía el cambio de contraseña con los campos de contraseña actual, contraseña nueva y confirmación de la nueva contraseña. Se revisaron la pantalla y el JavaScript de `Mi perfil`, además de las rutas, controladores, servicios y repositorios actuales de autenticación.

Se confirmó que esta función todavía no existe: el perfil solo permite actualizar nombre, apellidos, teléfono y fecha de nacimiento, y el backend no expone una ruta para cambiar la contraseña. La implementación correcta queda definida de esta manera:

- Solicitar la contraseña actual y comprobarla contra el hash almacenado antes de aceptar el cambio.
- Solicitar una contraseña nueva que cumpla las mismas reglas del registro.
- Solicitar la confirmación de la contraseña nueva y exigir que ambas coincidan.
- Incorporar el control común de mostrar u ocultar en los tres campos.
- Impedir reutilizar la contraseña actual como contraseña nueva.
- Generar un hash nuevo con `bcrypt` y no almacenar ni registrar ninguna contraseña en texto claro.
- Confirmar el resultado al usuario y limpiar los tres campos después de completarlo.

Este punto queda pendiente de implementación hasta que el usuario confirme que desea agregarlo como el siguiente cambio.

El usuario confirmó inmediatamente que deseaba implementar la función. El pendiente anterior quedó resuelto mediante un cambio completo de interfaz, API y persistencia.

#### Implementación del cambio de contraseña

En `public/compartido/perfil.html` se agregó una tarjeta `Cambiar contraseña` dentro de `Mi perfil`, disponible para entrenadores y atletas autenticados. Contiene los campos `Contraseña actual`, `Nueva contraseña` y `Confirmar nueva contraseña`, con límites, requisitos y atributos de autocompletado apropiados. Los tres campos utilizan el componente común de mostrar u ocultar contraseña mediante un ojo independiente.

`public/js/compartido/perfil.js` inicializa esos controles y administra el nuevo formulario. Antes de llamar al servidor comprueba que las contraseñas nuevas coincidan y que la nueva no sea idéntica a la actual. Después de un cambio correcto limpia todos los campos y muestra `Contraseña actualizada correctamente.`; los errores mantienen el formulario disponible para su corrección.

Se incorporó la ruta autenticada `PUT /api/auth/password`. La validación del servidor exige la contraseña actual y aplica a la contraseña nueva las mismas reglas del registro: entre 8 y 72 caracteres, al menos una mayúscula y un número. El controlador utiliza exclusivamente el identificador de la sesión, por lo que un usuario no puede indicar la cuenta de otra persona.

En el servicio de autenticación se implementó el siguiente flujo seguro:

1. Obtener al usuario activo por su identificador de sesión.
2. Comparar la contraseña actual con el hash almacenado mediante `bcrypt`.
3. Rechazar el cambio si la contraseña actual es incorrecta.
4. Comparar la nueva contraseña con el hash existente y rechazar su reutilización.
5. Generar un hash nuevo con un coste de 12 rondas.
6. Actualizar únicamente `password_hash`; la contraseña en texto claro nunca se almacena ni se registra.

Los archivos de backend modificados fueron `src/routes/auth.routes.js`, `src/controllers/auth.controller.js`, `src/services/auth.service.js` y `src/repositories/auth.repository.js`. No fue necesaria una migración porque la tabla `users` ya contiene `password_hash` y su marca `updated_at` se actualiza mediante el trigger existente.

Se creó `test/change-password.test.js`, la primera prueba automatizada del proyecto. La prueba utiliza PostgreSQL local y un usuario temporal aislado para comprobar cuatro comportamientos: rechazo de una contraseña actual incorrecta, rechazo de reutilizar la contraseña vigente, cambio correcto, rechazo posterior de la contraseña antigua y acceso exitoso con la nueva. Su limpieza verifica el identificador y el correo del usuario temporal antes de eliminarlo y exige que se elimine exactamente una fila, sin modificar las cuentas demo.

Se ejecutaron comprobaciones sintácticas sobre todos los módulos de backend modificados y sobre el JavaScript del perfil; todas terminaron correctamente. También se importó la aplicación completa sin errores. Finalmente, `npm.cmd test` informó 1 prueba aprobada, 0 fallidas y confirmó la limpieza correcta del usuario temporal.

## Continuación del 11 de agosto de 2026

Al iniciar la sesión, el usuario pidió volver a leer la visión completa, recuperar el punto exacto del proyecto y mantener en este documento una bitácora de todo cambio material realizado durante el día. El archivo solicitado como `VISION_PROYECTO.md` no existe en el repositorio; se confirmó que el documento vivo correcto es `VISION_PRODUCTO.md`, por lo que se continuará actualizando este archivo sin crear un duplicado con otro nombre.

Se revisaron el documento completo, la estructura actual del proyecto, el historial reciente de Git y el estado del árbol de trabajo. La rama activa es `main`, coincide con `origin/main`, el árbol estaba limpio al comenzar y el último commit es `8cd7a95` (`Arreglando contrasenas`). Ese commit contiene la visibilidad y confirmación de contraseñas, la función autenticada para cambiar la contraseña y su prueba automatizada.

El punto exacto donde quedó el trabajo es el siguiente:

- La primera versión modular del MVP ya existe, con frontend multipágina, API de Node.js/Express, PostgreSQL, migraciones, datos demo, sesiones, roles, vinculaciones, rutinas, nutrición, progreso, check-ins y mensajería.
- PostgreSQL local, las migraciones, los datos demo y el arranque local ya se habían comprobado.
- El proyecto está publicado en GitHub y el servicio de Render llegó a arrancar correctamente conectado al entorno de producción después de rotar y corregir `SESSION_SECRET`.
- Neon contiene el proyecto y la base `gymtrack`; el documento previo no dejó una confirmación explícita de que las migraciones de producción y todos los recorridos principales se verificaran desde el sitio público.
- El último desarrollo terminado fue el cambio seguro de contraseña desde `Mi perfil`. No hay cambios de código pendientes en el árbol local al comienzo de esta sesión.

Como verificación de hoy se ejecutó nuevamente `npm.cmd test` contra PostgreSQL local. El resultado fue 1 prueba aprobada, 0 fallidas; se confirmó otra vez el flujo de cambio de contraseña y la limpieza del usuario temporal. Durante la ejecución apareció una advertencia de compatibilidad futura de `pg`/`pg-connection-string` sobre los modos SSL. No rompe la versión actual, pero conviene revisar la configuración y hacer explícito `sslmode=verify-full` antes de actualizar a `pg` 9.

### Recomendación para continuar

La prioridad recomendada es cerrar primero la validación del despliegue público antes de agregar más funciones. Se debe confirmar en Render y Neon, sin compartir secretos, que `/api/health` responde correctamente y realizar una prueba de humo del recorrido completo: registro, inicio y cierre de sesión, invitación entrenador-atleta, asignación y consulta de rutina, registro de progreso o check-in, mensajería y cambio de contraseña. Esto descubrirá diferencias de cookies, CORS/origen, WebSockets, permisos o esquema entre el entorno local y producción.

Después de esa validación, el siguiente bloque recomendado es ampliar las pruebas automatizadas. Actualmente solo existe una prueba, enfocada en cambio de contraseña. El orden de mayor valor es autenticación y autorización por roles, vinculaciones e invitaciones, acceso aislado a datos de atletas, rutinas y mensajería. Antes de utilizar información real también siguen siendo necesarios almacenamiento privado externo para archivos y fotografías, respaldos, recuperación de contraseña, revisión de privacidad y endurecimiento general de seguridad.

El punto de continuación inmediato queda, por tanto, en verificar el despliegue público de extremo a extremo y registrar aquí los resultados, errores y correcciones. Durante el resto del 11 de agosto de 2026, cada decisión, archivo modificado, prueba ejecutada, error relevante y pendiente nuevo se añadirá a esta sección, sin registrar contraseñas, tokens ni cadenas de conexión.

### Consulta y modificación de rutinas por el entrenador

El usuario señaló que, después de crear una rutina como entrenador, el plan quedaba cerrado: la lista solo mostraba un resumen y no ofrecía mecanismos para consultar sus ejercicios ni aplicar cambios. Se confirmó que la API ya tenía una consulta individual protegida, pero la interfaz del entrenador no la utilizaba y el backend no disponía de una operación de actualización.

La pantalla `Rutinas` ahora incorpora las acciones `Ver rutina` y `Modificar` en cada plan. La primera despliega el detalle de los días, ejercicios, series, repeticiones y descansos sin abandonar la lista. La segunda abre el mismo formulario utilizado para crear rutinas, cargando previamente el nombre, atleta, descripción, fecha inicial, nombre del día y ejercicios existentes. Desde allí se pueden cambiar esos datos, agregar ejercicios, quitar ejercicios y modificar series, repeticiones o descansos.

Se agregó la ruta autenticada y exclusiva para entrenadores `PUT /api/routines/:id`. El servidor valida nuevamente todo el contenido, comprueba que el atleta siga vinculado al entrenador y verifica que la rutina pertenezca al entrenador autenticado. No es posible modificar una rutina ajena indicando manualmente otro identificador.

Para conservar la integridad de entrenamientos históricos, una modificación no elimina ni reescribe los días y ejercicios que pudieran estar referenciados por registros anteriores. Dentro de una sola transacción, la versión previa se marca como archivada y se crea una versión nueva con los cambios. Las versiones archivadas dejan de aparecer en la lista normal del entrenador y del atleta, mientras sus referencias históricas permanecen disponibles en la base de datos. No fue necesaria una migración nueva porque el esquema existente ya admite el estado `archived`.

Se comprobaron sintácticamente todos los módulos modificados, se importó la aplicación completa y se ejecutó `npm.cmd test`, con 1 prueba aprobada y 0 fallidas. Además, se realizó una prueba de integración temporal contra PostgreSQL local: se creó una rutina, se modificó, se comprobó que la anterior quedara archivada, que la nueva conservara el contenido actualizado y que otro usuario no pudiera reemplazarla. Todos los registros temporales se eliminaron al finalizar. Queda pendiente que el usuario confirme visualmente el recorrido en el navegador y, después de publicar los cambios, repetirlo en Render.

### Biblioteca de ejercicios del entrenador

El usuario solicitó una sección donde cada entrenador pueda crear sus propios ejercicios, incluir un enlace a un video demostrativo y utilizarlos posteriormente desde el selector de creación o modificación de rutinas. También definió que un ejercicio personalizado puede eliminarse si nunca ha formado parte de una rutina, pero si ya fue utilizado debe conservarse y permitir únicamente su desactivación.

Se creó la nueva pantalla `Ejercicios`, accesible desde la navegación del entrenador. La biblioteca separa los ejercicios personalizados del entrenador y los ejercicios generales disponibles para toda la plataforma. El formulario permite registrar nombre, grupo muscular, instrucciones y una URL pública opcional para el video. Los ejercicios personalizados se pueden editar, activar o desactivar. La interfaz muestra si están activos y si ya se encuentran en uso; cuando existe una referencia en alguna rutina, no presenta la acción de eliminación.

La seguridad y las reglas no dependen únicamente de la interfaz. La API permite listar la biblioteca, crear ejercicios, editar exclusivamente los ejercicios propios, cambiar su estado y solicitar su eliminación. Los ejercicios generales no pueden ser modificados desde una cuenta de entrenador, y un entrenador tampoco puede administrar los ejercicios privados de otro. Al eliminar, el servidor comprueba dentro de una transacción si existe alguna referencia en `routine_exercises`: si nunca se usó, se elimina definitivamente; si fue usado, responde que solo puede desactivarse. Esto protege también rutinas archivadas e historiales anteriores.

La consulta utilizada por los combobox de creación y edición de rutinas ahora devuelve únicamente ejercicios activos: incluye los generales activos y los personalizados activos del entrenador autenticado. Un ejercicio desactivado deja de ofrecerse para rutinas nuevas, pero continúa existiendo y siendo legible dentro de las rutinas históricas que ya lo contienen.

Se agregó y aplicó localmente la migración `003_exercise_status.sql`, que incorpora `is_active` con valor inicial verdadero e indexa los ejercicios personalizados por propietario y estado. Antes de desplegar esta versión, la misma migración deberá ejecutarse contra Neon; el código nuevo no debe publicarse en Render sin aplicar primero esta actualización de esquema.

Se comprobaron sintácticamente los módulos modificados, la aplicación completa se importó correctamente y `npm.cmd test` terminó con 1 prueba aprobada y 0 fallidas. También se ejecutó una verificación de integración temporal contra PostgreSQL local que confirmó: aparición de un ejercicio propio activo en el selector, bloqueo de edición por otro usuario, eliminación definitiva cuando no tiene referencias, rechazo de eliminación cuando ya forma parte de una rutina, desactivación correcta y permanencia del ejercicio usado dentro de la biblioteca. La rutina y los ejercicios temporales se eliminaron al terminar. Queda pendiente la revisión visual del usuario en el navegador y posteriormente aplicar la migración en Neon, publicar el código y repetir el recorrido en Render.

### Instrucciones y videos durante el entrenamiento

El usuario observó que almacenar instrucciones y un enlace de video no aporta valor si el atleta solo puede ver el nombre del ejercicio. Se acordó presentar la ayuda tanto al consultar una rutina antes de comenzar como durante el registro de cada ejercicio, sin obligar al atleta a abandonar la pantalla ni perder los valores escritos.

La vista de rutinas del atleta ahora muestra, junto a cada ejercicio, series, objetivo de repeticiones y descanso. Cuando existen instrucciones aparece `Ver instrucciones`, que despliega y vuelve a plegar el texto dentro de la misma tarjeta. Cuando existe un enlace aparece `Ver video`. Durante la ejecución se agrupan las series bajo cada ejercicio y se repiten esos mismos controles de ayuda por ejercicio, evitando repetir la descripción y el botón en cada serie individual.

Se agregó un modal adaptable para los videos. Los enlaces estándar de YouTube, YouTube abreviado y Vimeo se transforman en reproductores integrados; la política de seguridad del servidor autoriza marcos únicamente desde YouTube y Vimeo. Para cualquier otro proveedor se presenta un mensaje y un enlace seguro para abrir el recurso en otra pestaña. Al cerrar el modal mediante el botón, el fondo o la tecla Escape, el reproductor se elimina para detener el video y el formulario del entrenamiento permanece intacto.

Los nombres, instrucciones y enlaces se escapan antes de incorporarlos a la interfaz para impedir que contenido introducido por un entrenador se interprete como HTML. Los enlaces externos utilizan `noopener noreferrer`. Se comprobaron la sintaxis del módulo del atleta y del servidor, la aplicación se importó correctamente, `git diff --check` no encontró errores y `npm.cmd test` terminó con 1 prueba aprobada y 0 fallidas. Queda pendiente la confirmación visual en un navegador con ejercicios que tengan instrucciones, un video de YouTube o Vimeo y un enlace de otro proveedor.

#### Corrección de datos de ayuda en el detalle de la rutina

Durante la comprobación visual, el usuario informó que el ejercicio personalizado `Lagartijas` aparecía ante el atleta como si no tuviera instrucciones ni video. Se consultó PostgreSQL local y se confirmó que el ejercicio sí conserva la instrucción y el enlace de YouTube introducidos por el entrenador, y que ya forma parte de una rutina. El problema estaba en la consulta del detalle: el objeto JSON de cada ejercicio incluía planificación y nombre, pero omitía `instructions` y `mediaUrl`.

Se corrigió `getRoutine` en el repositorio de rutinas para incluir ambos campos desde la tabla `exercises`. No fue necesario volver a crear ni modificar el ejercicio, ni aplicar una migración adicional. Se verificó directamente con la rutina que contiene `Lagartijas` que la respuesta ahora entrega exactamente su instrucción y su URL de video. También se comprobó la sintaxis, se importó la aplicación completa, `git diff --check` no encontró errores y `npm.cmd test` terminó con 1 prueba aprobada y 0 fallidas.

## Continuación del 12 de agosto de 2026

Al iniciar la sesión el usuario pidió revisar toda la documentación existente y analizar todo lo hecho hasta ahora. Se leyeron `README.md` y `VISION_PRODUCTO.md` completos y se contrastaron contra `git log` y `git status`; el árbol estaba limpio y el commit `a692d5a` ("cambios a la app") ya incluía tanto el código de edición de rutinas/biblioteca de ejercicios como la propia actualización de esta bitácora, por lo que no había trabajo sin documentar.

A continuación el usuario pidió una revisión completa del código y una opinión sobre su calidad. Se leyeron íntegramente: `src/app.js`, `src/server.js`, configuración de entorno y base de datos, middlewares de autenticación/errores/validación, los cinco módulos backend completos (auth, links, routines, tracking, messages) en sus cuatro capas, el socket de chat, el esquema SQL de `001_initial_schema.sql`, `package.json`, la prueba automatizada existente y una muestra amplia de los 20 módulos de JavaScript del navegador.

### Hallazgos de la revisión

**Fortalezas confirmadas:** arquitectura en capas consistente en los cinco módulos sin mezclar SQL con HTTP; SQL parametrizado en el 100% de las consultas revisadas (sin riesgo de inyección); validación con Zod en cada endpoint mutante; esquema PostgreSQL con `CHECK`, `UNIQUE` compuestas e índices parciales bien pensados; bcrypt costo 12; sesiones persistidas en PostgreSQL con cookies `httpOnly`/`sameSite=lax`/`secure` en producción; Helmet con CSP explícita; autorización correcta por vínculo activo o pertenencia en los módulos `links`, `tracking` y `messages`, incluido el socket de chat.

**Hallazgo crítico — XSS almacenado sistémico:** casi todos los módulos del navegador insertaban datos provenientes del servidor directamente en `innerHTML` sin escapar. Como el backend no restringe caracteres en campos como el nombre del usuario (`firstName`/`lastName` solo validan longitud), un registro malicioso podía ejecutar JavaScript arbitrario en el navegador de cualquier otro usuario que viera ese nombre, un mensaje de chat, un check-in, un plan nutricional o una rutina. La única excepción ya corregida antes de hoy era `public/js/atleta/rutinas.js`, que definía su propia función `escapeHtml` local para instrucciones y video de ejercicios, pero ese patrón nunca se compartió con el resto de las pantallas.

**Hallazgo menor — falta de verificación de pertenencia en entrenamientos:** en `src/repositories/routines.repository.js`, `startWorkout` y `finishWorkout` no comprueban que el `routineDayId` ni los `routineExerciseId` enviados por el atleta pertenezcan realmente a una rutina que le fue asignada. Impacto bajo (los UUID no son adivinables y solo afecta datos propios del atleta), pero es una comprobación de autorización que el resto del código sí aplica siempre. **Queda pendiente de corrección**, no se tocó en esta sesión.

Puntos menores adicionales, también pendientes: solo existe 1 prueba automatizada en todo el proyecto; no hay token CSRF explícito (se apoya únicamente en `sameSite=lax`); la dependencia `multer` está declarada en `package.json` pero no se usa en ningún archivo de `src` todavía.

### Corrección aplicada: XSS almacenado

Se creó `public/js/comun/dom.js`, que exporta una única función `escapeHtml` reutilizable (antes duplicada de forma local). Se aplicó en los 15 módulos del navegador que interpolaban datos de servidor en `innerHTML` sin escapar:

`public/js/comun/navigation.js` (nombre del usuario en el menú lateral, presente en toda página autenticada), `public/js/compartido/mensajes.js` (cuerpo del chat, nombre del interlocutor, vista previa del último mensaje), `public/js/compartido/perfil.js` (lista de vínculos), `public/js/entrenador/atletas.js`, `public/js/entrenador/panel.js`, `public/js/entrenador/checkins.js` (logros, dificultades, molestias y retroalimentación de check-ins), `public/js/entrenador/nutricion.js`, `public/js/entrenador/rutinas.js`, `public/js/entrenador/rutina-formulario.js`, `public/js/entrenador/ejercicios.js`, `public/js/atleta/panel.js`, `public/js/atleta/historial.js`, `public/js/atleta/nutricion.js`, `public/js/atleta/checkin.js`. También se refactorizó `public/js/atleta/rutinas.js` para importar la utilidad compartida en lugar de mantener su copia local.

Se revisaron los archivos restantes que también usan `innerHTML` (`public/js/atleta/progreso.js`, `public/js/entrenador/invitaciones.js`, `public/js/entrenador/ejercicios.js` en sus dos llamadas restantes) y no requerían cambios: solo interpolan números o valores generados por el servidor (código de invitación aleatorio, estado tipo enum), nunca texto libre escrito por un usuario.

**Verificación:** los 16 archivos modificados o creados pasaron `node --check` sin errores; `git diff --check` no reportó errores de formato; `npm.cmd test` terminó con 1 prueba aprobada y 0 fallidas contra PostgreSQL local, sin regresiones. No fue necesaria ninguna migración ni cambio de backend para esta corrección. Queda pendiente la confirmación visual en el navegador (registrar un usuario con un nombre que contenga `<` o `>` y verificar que se muestre como texto literal en el sidebar, el chat y la lista de atletas) y, después, publicar el cambio en Render.

### Acuerdo renovado de bitácora continua

El usuario reafirmó que quiere que absolutamente todo lo que se trabaje —incluyendo lo que se le proponga y lo que se decida— quede registrado en este documento a medida que ocurre, para poder retomar el proyecto sin pérdida de contexto si se cierra la sesión. Esta sección se mantendrá actualizada durante el resto del 12 de agosto de 2026 conforme avance el trabajo.

### Punto de continuación

1. Revisar visualmente el rediseño en el navegador: computadora, tablet y celular; menú deslizante y barra inferior; cambio entre tema claro y oscuro; gráficas de progreso con mediciones reales.
2. Confirmar visualmente que el escape de HTML funciona (nombre con caracteres especiales, mensaje de chat con `<script>` de prueba) antes de publicar.
3. Aplicar la migración `003_exercise_status.sql` en Neon, que sigue pendiente desde el 11 de agosto y bloquea publicar en Render el código de biblioteca de ejercicios.
4. Publicar en Render la corrección del XSS junto con el rediseño y repetir ambas confirmaciones en producción.
5. Decidir si se corrige ahora o se deja pendiente la falta de verificación de pertenencia en `startWorkout`/`finishWorkout` (hallazgo menor, ver arriba).
6. Seguir con la prioridad ya documentada el 11 de agosto: prueba de humo completa del despliegue público y ampliación de pruebas automatizadas.

### Rediseño de la interfaz gráfica

El usuario solicitó rediseñar por completo la interfaz para que resulte atractiva y moderna, y para que se adapte correctamente a computadora, tablet y celular. Pidió explícitamente entender el alcance antes de que se modificara nada.

**Diagnóstico de la interfaz anterior.** Se revisaron las 18 páginas HTML y los tres archivos CSS. La base tenía una paleta y tipografías correctas (verde `#145c3d`, Manrope y DM Sans), pero se encontraron estos problemas:

- Existía un único punto de quiebre responsivo (`800px`), sin ningún diseño intermedio para tablet.
- En celular el menú lateral se convertía en un bloque de nueve enlaces sobre el contenido, obligando a desplazarse por todo el menú antes de ver la página. Era el peor problema de usabilidad, justo en el dispositivo donde el atleta usa la aplicación.
- Los tres archivos CSS estaban minificados en cinco líneas en total, lo que hacía inviable mantenerlos o evolucionarlos.
- No había iconos, estados de carga, modo oscuro ni transiciones.
- Las gráficas de progreso, presentes en el MVP desde el principio, nunca se implementaron: `progreso.js` solo mostraba una lista de texto.
- Se detectó además que la política de seguridad de contenido definida en `src/app.js` no incluye `'unsafe-inline'` en `styleSrc`, por lo que los atributos `style=` escritos directamente en `public/entrenador/panel.html` y `public/atleta/rutinas.html` estaban siendo bloqueados por el navegador y nunca se aplicaron. Se corrigen moviéndolos a clases de CSS.

**Decisiones tomadas por el usuario.** Se le presentaron cuatro decisiones y eligió:

1. **Dirección visual:** oscuro atlético premium, con fondo profundo y acentos de verde neón, conservando el lima `#a8ef6a` de la identidad original.
2. **Temas:** soporte para modo claro y oscuro, siguiendo automáticamente la preferencia del sistema y con un botón para cambiarlo manualmente.
3. **Navegación en celular:** combinación de barra inferior fija con los accesos más frecuentes y menú lateral deslizante con el resto de las secciones.
4. **Alcance:** rediseño visual completo más la implementación de las gráficas de progreso pendientes.

**Restricciones respetadas.** Se mantiene el HTML multipágina con JavaScript modular sin framework, según la preferencia ya registrada del usuario. No se usan librerías externas por CDN porque la CSP solo autoriza scripts propios; todo el CSS es propio y las gráficas se construyen como SVG escrito a mano. Tampoco se modifica la API ni la lógica de negocio: el trabajo es de capa visual. Como la CSP también bloquea scripts en línea, el tema se aplica mediante un script propio cargado antes del pintado para evitar el parpadeo de fondo claro al abrir cada página.

#### Implementación del rediseño

**Sistema de diseño.** Los tres archivos CSS se reescribieron por completo, ahora legibles y comentados en lugar de minificados. `base.css` define el conjunto de tokens de color, tipografía, espaciado, elevación y movimiento. El tema claro se declara en `:root` y el oscuro se aplica por dos vías independientes: `@media (prefers-color-scheme: dark)` para seguir al sistema, y `:root[data-theme='dark']` para la elección manual, que siempre gana. Cada componente lee sus colores de esos tokens, por lo que ninguna pieza necesita reglas duplicadas por tema. Se añadieron bloques de carga animados y se respeta `prefers-reduced-motion`.

**Estructura responsiva.** `layout.css` define tres comportamientos según el ancho disponible. Desde 1024 px se muestra el menú lateral fijo de siempre. Por debajo de ese ancho el mismo elemento lateral se convierte en un menú deslizante que entra desde la izquierda con fondo oscurecido, y aparecen una barra superior con el botón de menú y una barra inferior fija con los cuatro accesos más usados de cada rol más un botón `Más` que abre el menú completo. La barra inferior respeta `env(safe-area-inset-bottom)` para no quedar bajo la barra de gestos de los teléfonos modernos. Las rejillas usan `auto-fit` con anchos mínimos, de modo que se reorganizan solas sin depender de puntos de quiebre adicionales.

**Módulos nuevos.** Se crearon cinco archivos en `public/js/comun/`: `icons.js` con un juego de veinte iconos SVG propios que heredan el color del texto; `theme-init.js`, script clásico que se carga en `<head>` y aplica el tema guardado antes del primer pintado; `theme.js`, que construye los botones de cambio de tema y mantiene sincronizados todos los que existan en pantalla; `charts.js`, el generador de gráficas; y `dom.js`, creado antes en esta misma sesión para el escape de HTML.

**Gráficas de progreso.** Quedó implementada la funcionalidad que faltaba desde el MVP. `charts.js` dibuja gráficas de línea en SVG con área degradada, rejilla, ejes, puntos con detalle emergente y encabezado con el valor más reciente y su variación. En lugar de escalar un `viewBox`, mide el ancho real del contenedor y redibuja al cambiar el tamaño de la ventana, para que las etiquetas conserven un tamaño legible tanto en monitor como en celular. La pantalla de progreso del atleta muestra ahora la evolución del peso y de la cintura junto al historial. Se decidió expresamente que la variación se muestre en un tono neutro con una flecha de dirección, y no en verde o rojo, porque subir o bajar de peso no es bueno ni malo en sí mismo y la aplicación no conoce el objetivo de cada persona.

**Páginas.** Las 18 páginas HTML se reescribieron en formato legible, con etiquetas `label` asociadas a sus campos mediante `for`/`id`, textos de ayuda, y bloques de carga en las secciones que esperan datos. Se eliminaron todos los atributos `style=` que la CSP bloqueaba, sustituidos por clases (`.mt`, `.grid.messages`, `.chat-form`). Las pantallas de acceso recibieron un tratamiento propio con panel lateral degradado, lista de ventajas y botón de cambio de tema disponible antes de iniciar sesión.

**Verificaciones ejecutadas.** Todos los módulos JavaScript de `public/js` pasaron `node --check`. Se comprobó automáticamente que no queda ningún `style=` en el HTML, que las 18 páginas cargan `theme-init.js`, que todas las rutas de CSS y JavaScript referenciadas existen en disco, y que cada identificador consultado por el JavaScript de cada página existe en su HTML correspondiente. Se levantó el servidor y se confirmó `{"status":"ok"}` en `/api/health` junto con respuesta 200 en las páginas y recursos nuevos. Se verificó en la cabecera real que la CSP entrega `script-src 'self'` y `style-src 'self' https://fonts.googleapis.com`, coherente con el diagnóstico. El generador de gráficas se probó con una comprobación temporal sobre cinco casos: serie normal, un solo punto, valores idénticos, sin datos y con valores nulos; los cinco produjeron salida correcta sin `NaN` ni `undefined`, y el archivo temporal se eliminó al terminar. Finalmente `npm.cmd test` terminó con 1 prueba aprobada y 0 fallidas, y `git diff --check` no encontró errores de formato.

**Archivos afectados.** Se modificaron los tres archivos CSS, las 18 páginas HTML y 17 módulos JavaScript; se crearon `public/js/comun/icons.js`, `theme-init.js`, `theme.js` y `charts.js`. No se tocó ningún archivo de `src`, ni la base de datos, ni las migraciones.

**Pendiente de este trabajo.** Falta la confirmación visual del usuario en un navegador real: revisar las pantallas en computadora, tablet y celular, comprobar el menú deslizante y la barra inferior, alternar entre tema claro y oscuro, y verificar las gráficas con mediciones reales. Después de esa revisión el cambio puede publicarse en Render, teniendo en cuenta que la migración `003_exercise_status.sql` sigue pendiente en Neon y bloquea el despliegue del código de biblioteca de ejercicios.

## Continuación del 13 de agosto de 2026

Al iniciar la sesión el usuario pidió releer este documento completo, recuperar el punto exacto donde quedó el trabajo del día anterior, recibir una sugerencia sobre cómo continuar y renovó explícitamente el acuerdo de registrar aquí absolutamente todo lo que se converse, se proponga y se decida a partir de ahora.

Se revisó el estado de Git antes de sugerir nada: la rama activa es `main`, coincide con el historial esperado y el último commit es `701ec18` ("Using claude update", 12 de agosto a las 22:32), que corresponde exactamente al rediseño completo de interfaz documentado en la sección anterior (18 páginas HTML, los tres CSS y los módulos JavaScript nuevos y modificados). No quedó ningún trabajo del 12 de agosto sin documentar.

Se detectó un único cambio local sin confirmar: `public/js/atleta/checkin.js` aparece modificado, pero la diferencia real es únicamente la eliminación del salto de línea final del archivo; el contenido JavaScript es idéntico byte a byte salvo por eso. Es probable que lo haya producido el editor al abrir el archivo (el sistema señaló que el usuario tiene ese archivo abierto en el IDE). No representa trabajo funcional nuevo ni necesita documentarse como cambio de producto; queda pendiente que el usuario decida si descarta ese cambio de formato o lo conserva.

### Punto exacto heredado

Según la última sección registrada (12 de agosto), sigue pendiente, en este orden recomendado:

1. Confirmación visual del rediseño en el navegador (computadora, tablet, celular; menú deslizante y barra inferior; tema claro/oscuro; gráficas de progreso con datos reales).
2. Confirmación visual de que el escape de HTML funciona (nombre con `<`/`>`, mensaje de chat con `<script>` de prueba).
3. Aplicar la migración `003_exercise_status.sql` en Neon (pendiente desde el 11 de agosto; bloquea publicar en Render el código de biblioteca de ejercicios).
4. Publicar en Render el rediseño junto con la corrección de XSS, y repetir ambas confirmaciones ya en producción.
5. Decidir si se corrige ahora la falta de verificación de pertenencia en `startWorkout`/`finishWorkout` (hallazgo menor del 12 de agosto).
6. Prueba de humo completa del despliegue público y ampliación de pruebas automatizadas (prioridad ya documentada el 11 de agosto).

### Sugerencia para hoy

Se recomendó al usuario empezar por el paso 1 (revisión visual local del rediseño), porque es el único punto que no depende de tocar Neon ni Render y porque cualquier ajuste visual que se detecte conviene corregirlo antes de aplicar la migración y publicar. Queda pendiente la respuesta del usuario sobre por dónde continuar exactamente.

### El tema oscuro pasa a ser el predeterminado

El usuario pidió que el modo oscuro sea siempre el predeterminado. Hasta ahora la aplicación seguía la preferencia del sistema operativo: quien tuviera Windows en modo claro veía GymTrack en claro. Se interpretó la solicitud como que el oscuro sea el punto de partida en todos los casos, conservando el botón para cambiar a claro manualmente; esa elección manual se sigue recordando en el navegador.

**Decisión de implementación.** En lugar de forzar el oscuro desde JavaScript sobre una base clara, se invirtió la base del sistema de diseño. El oscuro es ahora el tema declarado en `:root`, por lo que es lo que se ve incluso antes de que corra cualquier script; el claro pasó a ser un bloque de excepción `:root[data-theme='light']`. Esto evita por completo el destello de fondo claro al abrir cada pantalla y elimina la dependencia de la preferencia del sistema.

**Cambios realizados:**

- `public/css/base.css`: los tokens de color de `:root` se reemplazaron por la paleta oscura y `color-scheme` pasó de `light` a `dark`. Se eliminaron los dos bloques anteriores —el `@media (prefers-color-scheme: dark)` y el `:root[data-theme='dark']`— y en su lugar quedó un único bloque `:root[data-theme='light']` con la paleta clara. La aplicación ya no consulta `prefers-color-scheme` en ninguna parte. El resto del CSS no necesitó cambios porque cada componente lee sus colores de esos tokens.
- `public/js/comun/theme-init.js`: antes marcaba el documento cuando había cualquier tema guardado; ahora solo lo marca cuando la elección guardada es `light`. Si no hay nada guardado, la página arranca en oscuro.
- `public/js/comun/theme.js`: `currentTheme()` ya no consulta `matchMedia`, sino que devuelve `light` únicamente si el documento está marcado así y `dark` en cualquier otro caso. Se eliminó el escucha de cambios de la preferencia del sistema, que dejó de tener sentido.
- Las 18 páginas HTML cambiaron `<meta name="color-scheme" content="light dark">` por `"dark light"`, para que el navegador pinte el lienzo inicial en oscuro antes incluso de aplicar la hoja de estilos.

No se tocó ningún archivo de `src`, ni la API, ni la base de datos, ni las migraciones. El cambio es exclusivamente de capa visual.

**Verificaciones ejecutadas.** `node --check` sobre los dos módulos de tema, sin errores. Comprobación programática de que las llaves de `base.css` quedan balanceadas, de que ya no existe ninguna referencia a `prefers-color-scheme` y de que sí existe el bloque `:root[data-theme='light']`. `git diff --check` no reportó errores de formato. `npm.cmd test` terminó con 1 prueba aprobada y 0 fallidas. Con el servidor local levantado se confirmó `{"status":"ok"}` en `/api/health`, que la hoja `/css/base.css` servida contiene una sola aparición de `data-theme` y ninguna de `prefers-color-scheme`, y que tanto `/` como `/atleta/panel.html` entregan ya el meta `content="dark light"`.

**Pendiente de este cambio.** Falta la confirmación visual del usuario en el navegador: abrir la aplicación con el sistema operativo en modo claro y comprobar que aun así arranca en oscuro, cambiar manualmente a claro con el botón, recargar y verificar que la elección se conserva, y volver a oscuro. Conviene revisarlo tanto en las pantallas de acceso como dentro de la aplicación autenticada.

### Legibilidad de todo el JavaScript

El usuario observó que muchos archivos JavaScript tenían todo el código apretado en una sola línea y pidió que cada instrucción ocupe su propio renglón, para poder leer el programa con facilidad. Preguntó además qué tan complicado era el cambio.

**Diagnóstico.** Se midieron los 60 archivos `.js` del proyecto. 33 ya eran legibles; **27 tenían líneas de más de 200 caracteres** y **11 de ellos eran literalmente un único renglón**. El peor caso era `public/js/compartido/perfil.js`, con 2.273 caracteres en una sola línea. Los CSS ya se habían reescrito legibles durante el rediseño del 12 de agosto, pero el JavaScript había quedado pendiente.

**Respuesta dada y decisión.** A mano el trabajo es tedioso y arriesgado; con un formateador automático es prácticamente trivial y sin riesgo de alterar el comportamiento, porque la herramienta interpreta el código como estructura y lo vuelve a escribir cambiando solo espacios y saltos. Se propusieron dos alcances y **el usuario eligió el más completo: formateo automático más una segunda pasada a mano con comentarios en español**, al estilo de los CSS del rediseño.

**Herramienta incorporada.** Se instaló **Prettier** como dependencia de desarrollo (no se envía al navegador; `npm audit` siguió sin vulnerabilidades). Se añadieron:

- `.prettierrc.json` con el estilo del proyecto: 100 columnas, indentación de 2 espacios, comillas simples, punto y coma, coma final y saltos de línea LF.
- `.prettierignore`, que deja fuera el CSS, el HTML y el resto de formatos. Se decidió expresamente **no** reformatear CSS ni HTML porque ya se escribieron a mano con una distribución pensada y volver a tocarlos solo ensuciaría el historial.
- Dos comandos nuevos en `package.json`: `npm run format` aplica el estilo y `npm run format:check` comprueba que se cumple, para que la legibilidad no se vuelva a perder.

**Primera pasada: formateo automático.** Antes de tocar nada se guardó una copia de seguridad de los 60 archivos. Prettier reformateó todo el JavaScript de `src`, `public/js`, `database` y `test`. Los archivos con líneas ilegibles bajaron de 27 a 15.

**Verificación de que el programa no cambió.** Se escribió una comprobación que analiza cada archivo con el propio analizador sintáctico de Prettier y compara el **árbol sintáctico** anterior con el nuevo, ignorando únicamente posiciones y comentarios. Resultado: **los 60 archivos tienen un árbol sintáctico idéntico**, es decir, ejecutan exactamente lo mismo. Se comprobó de paso que el cambio de saltos de línea CRLF a LF tampoco altera nada, porque JavaScript ya normaliza los saltos dentro de las plantillas de texto.

**Segunda pasada: reescritura a mano con comentarios.** Las 15 líneas largas que quedaban eran todas plantillas de HTML dentro de comillas, que un formateador no parte y hace bien en no partir. Se reescribieron a mano 15 archivos, separando el HTML en varias líneas, extrayendo funciones de dibujado con nombre (`renderPlan`, `renderCheckin`, `renderRoutineCard`, `renderSetRow`, etc.) y añadiendo comentarios en español que explican qué hace cada bloque y por qué:

`public/js/compartido/perfil.js`, `public/js/atleta/checkin.js`, `historial.js`, `nutricion.js`, `rutinas.js`, `public/js/entrenador/atletas.js`, `invitaciones.js`, `checkins.js`, `nutricion.js`, `rutinas.js`, `ejercicios.js`, `public/js/comun/charts.js`, `icons.js`, y los repositorios `src/repositories/messages.repository.js` y `tracking.repository.js`, cuyas consultas SQL quedaron indentadas por cláusulas y documentadas.

Los comentarios añadidos no son descriptivos de lo obvio: explican decisiones reales del código, como por qué un campo vacío se guarda como nulo y no como cero, por qué hay que volver a conectar los manejadores después de cada dibujado, por qué el `trainer_id` de una consulta es en realidad un control de permiso, o por qué se vacía el reproductor antes de cerrar la ventana del video.

**Resultado final.** De 60 archivos, **59 quedaron completamente legibles**. El único que conserva una línea larga es `public/js/comun/password-toggle.js`, y se dejó a propósito: esa línea es la cadena de coordenadas de un icono SVG, un dato de dibujo indivisible, no lógica de programa.

**Verificaciones ejecutadas.** Los 60 archivos pasaron `node --check`. `npm run format:check` confirma que todo el proyecto cumple el estilo. La aplicación completa se importó sin errores. Se escribió una comprobación adicional que valida que cada `import` del navegador apunte a un archivo existente y que cada identificador buscado con `querySelector('#…')` exista en el HTML de su página; encontró solo dos avisos, ambos correctos y esperados (`#workout`, que crea el propio JavaScript al dibujar el formulario de entrenamiento, y `socket.io.js`, que sirve la librería en tiempo de ejecución). Con el servidor levantado se comprobó `{"status":"ok"}` en `/api/health` y que **los 45 recursos públicos —páginas y módulos— responden 200**. `npm.cmd test` terminó con 1 prueba aprobada y 0 fallidas.

**Coste asumido conscientemente.** El JavaScript que descarga el navegador creció de 57 KB a 72 KB por los espacios y comentarios. Se aceptó porque para esta aplicación es irrelevante y, si algún día importara, la solución correcta es activar compresión en el servidor, no volver a escribir código ilegible.

**Pendiente de este cambio.** Los 45 archivos que solo pasaron por el formateador tienen garantía matemática de no haber cambiado. Los 15 reescritos a mano no la tienen, porque se reestructuraron a propósito, así que necesitan confirmación visual en el navegador: perfil y cambio de contraseña, check-in del atleta y su revisión por el entrenador, historial, ambas pantallas de nutrición, lista y detalle de rutinas, registro de un entrenamiento completo con instrucciones y video, biblioteca de ejercicios, lista de atletas, invitaciones y las gráficas de progreso.

## Continuación del 14 de agosto de 2026

Al iniciar la sesión el usuario pidió releer este documento completo, recibir una propuesta sobre cómo continuar, y renovó el acuerdo de registrar aquí absolutamente todo lo que se trabaje hoy para poder retomar el proyecto sin pérdida de contexto en el futuro.

Se revisó `git status` antes de proponer nada. La rama activa sigue siendo `main` y el último commit continúa siendo `701ec18` ("Using claude update"). Existe un bloque grande de cambios locales sin confirmar (unos 80 archivos modificados más `.prettierrc.json` y `.prettierignore` sin rastrear); se comparó contra la bitácora y coincide exactamente con el trabajo ya documentado el 13 de agosto: el tema oscuro como predeterminado y la reescritura de legibilidad de todo el JavaScript con Prettier. No se encontró ningún trabajo sin documentar ni ninguna pérdida de contexto entre sesiones.

### Propuesta presentada al usuario

Se recomendó seguir, en este orden, con la cadena de pendientes ya registrada el 12 y 13 de agosto, sin agregar funciones nuevas todavía:

1. Confirmación visual en el navegador del rediseño completo y, en particular, de los 15 archivos JavaScript reescritos a mano (sin garantía matemática de equivalencia, a diferencia de los 45 solo formateados por Prettier).
2. Confirmar en un commit el bloque de cambios del 13 de agosto una vez validado visualmente.
3. Aplicar la migración `003_exercise_status.sql` en Neon, pendiente desde el 11 de agosto y que bloquea publicar en Render la biblioteca de ejercicios.
4. Publicar en Render el rediseño y la migración, y repetir las confirmaciones ya en producción.
5. Decidir si se corrige ahora el hallazgo menor del 12 de agosto sobre `startWorkout`/`finishWorkout` (falta comprobar que el día y los ejercicios enviados por el atleta pertenezcan realmente a la rutina asignada).
6. Prueba de humo completa del despliegue público y ampliación de pruebas automatizadas (solo existe una prueba en todo el proyecto).

Se sugirió comenzar por el punto 1 por ser el único que no depende de tocar Neon ni Render. Queda pendiente la decisión del usuario sobre por dónde continuar exactamente.

### Rutinas semanales, días libres, duración y seguimiento de cumplimiento

El usuario revisó la aplicación, confirmó que el rediseño se ve bien y planteó el siguiente bloque de trabajo. Su objeción concreta es que el entrenador tiene que armar las rutinas día por día. Lo solicitado es:

1. Que la rutina se construya **por semana completa**, mostrando Día 1 a Día 7 en una sola pantalla.
2. Que cada día pueda marcarse como **día de entrenamiento, día libre o día libre opcional**.
3. Que el entrenador pueda indicar que **un día es igual a otro** (por ejemplo, el Día 4 igual al Día 1); se copia todo el contenido y el atleta ve la aclaración entre paréntesis, `Día 4 (igual al Día 1)`.
4. Que el entrenador decida **la duración del plan**: una semana, seis semanas, un mes, etc.
5. Que el atleta **vaya marcando cada ejercicio como completado** mientras entrena y que, al terminar todos los ejercicios de un día, ese día quede marcado como completado.
6. Que el entrenador **vea qué días completó cada atleta**.
7. Que todo ello tenga una **interfaz gráfica moderna al estilo Android**.

#### Diagnóstico del código actual

Antes de proponer nada se leyeron el esquema SQL, `src/repositories/routines.repository.js`, `src/services/routines.service.js`, `src/routes/routines.routes.js`, `public/js/entrenador/rutina-formulario.js`, `public/js/entrenador/rutinas.js`, `public/js/atleta/rutinas.js` y `public/js/entrenador/atletas.js`. Se encontró lo siguiente:

- La API **ya acepta varios días** por rutina, pero el formulario del entrenador solo construye uno y, al editar, únicamente lee `routine.days[0]`. La limitación es de interfaz, no de backend.
- **No existe** ningún concepto de semana, duración, tipo de día ni día espejo. `routine_days` solo tiene `name`, `day_order` y `notes`.
- El registro del entrenamiento es **todo o nada**: el atleta completa las series de todos los ejercicios y nada se guarda hasta pulsar `Finalizar entrenamiento`. No hay forma de marcar un ejercicio a la vez. Este es el cambio estructural más importante del bloque.
- El entrenador **no tiene ninguna visibilidad** del cumplimiento: la pantalla de atletas solo muestra el último peso y la fecha de la última medición.

#### Propuesta presentada

**Base de datos.** Una migración nueva `004_rutinas_semanales.sql`, compatible hacia atrás (las rutinas existentes quedan como plan de una semana con su día actual como Día 1):

- `routines`: columna `weeks` (1 a 52). `end_date` pasa a calcularse a partir de `start_date` y `weeks`.
- `routine_days`: columna `day_type` con valores `training`, `rest` y `optional_rest`, y columna `mirrors_day_order` para conservar la etiqueta del día espejo.
- `workout_sessions`: columna `week_number`, imprescindible para distinguir `Semana 2 · Día 3` de `Semana 1 · Día 3`.
- Tabla nueva `workout_exercise_log`, con una fila por ejercicio terminado dentro de una sesión. Es la pieza que hace posible marcar el avance ejercicio por ejercicio.

**Backend.** Se sustituye el guardado final por guardado incremental: un endpoint nuevo cierra un solo ejercicio, guardando sus series y registrándolo como hecho. Cuando queda marcado el último ejercicio del día, **el servidor cierra el día automáticamente**, sin depender de que el atleta pulse un botón final. Se añade `GET /api/routines/:id/progress` para que el entrenador obtenga la cuadrícula de semanas por días.

Se decidió **corregir dentro de este mismo trabajo el hallazgo menor pendiente desde el 12 de agosto**: `startWorkout` y `finishWorkout` no comprueban que el día ni los ejercicios enviados pertenezcan a una rutina asignada al atleta. Como ambas funciones se reescriben completas para el modelo semanal, la corrección no tiene coste adicional y cierra el punto 5 de la lista de pendientes.

**Interfaz.** Se construye con los tokens de diseño ya existentes y sin librerías externas, porque la política de seguridad de contenido solo autoriza scripts propios. Para el entrenador, una tira horizontal de siete chips de día al estilo de las pestañas de Material Design, con el día seleccionado editándose debajo, un punto indicador cuando el día tiene ejercicios y un icono de luna cuando es día libre; la duración se elige con un control segmentado. Para el atleta, un selector de semana y una fila de siete círculos con anillo de progreso que se rellenan con una marca de verificación al completarse, y tarjetas de ejercicio con casilla de completado más una barra de avance. Para el entrenador, un mapa de calor de semanas por días y un resumen del tipo `Semana 2 · 3 de 5 días` en la lista de atletas.

#### Decisiones tomadas por el usuario

Se le plantearon tres decisiones con sus alternativas y eligió las tres opciones recomendadas:

1. **Duración:** el entrenador arma **una sola semana y esa plantilla se repite** el número de semanas indicado. El cumplimiento se registra por separado en cada semana. Se descartó por ahora permitir contenido distinto en cada semana (progresión planificada), que multiplicaría la complejidad del constructor; puede añadirse más adelante sobre esta misma base.
2. **Días espejo:** se **copia el contenido y se mantiene sincronizado durante la edición**. Mientras el entrenador modifica el Día 1, el Día 4 se actualiza solo en el formulario; al guardar, cada día queda con sus propias filas en la base de datos. Así el historial de cada día es independiente y modificar la rutina más adelante nunca corrompe entrenamientos ya registrados. Se descartaron el enlace permanente (mezclaría el historial de ambos días) y la copia única sin sincronización (obligaría a repetir cada cambio a mano).
3. **Ritmo de trabajo:** se avanza **por fases con revisión al final de cada una**: fase 1 base de datos y API, fase 2 constructor semanal del entrenador, fase 3 pantalla del atleta con marcado de ejercicios, fase 4 vista de progreso del entrenador.

El usuario confirmó y se comenzó la fase 1.

#### Fase 1 terminada: base de datos y API

**Comprobación previa de los datos.** Antes de escribir la migración se inspeccionó la base local. Se encontró que existen **dos pares de sesiones duplicadas** (mismo atleta y mismo día de rutina). Eso descartó añadir una restricción `UNIQUE` por franja semanal: para satisfacerla habría que inventar números de semana en filas históricas, lo que corrompería datos reales. Se resolvió permitiendo varias sesiones por franja y agregando el estado en la consulta. Además resultó ser el modelo correcto y no un apaño, porque repetir un día dentro de la semana es legítimo.

También se descubrió que **las cuentas demo `entrenador@demo.local` y `atleta@demo.local` ya no existen** en la base local; el usuario trabaja con dos cuentas propias (`marcoespinoza56@gmail.com` como entrenador y `mespinoza1986@gmail.com` como atleta). Las credenciales demo que documenta `README.md` ya no sirven en este equipo. No es un fallo, pero conviene tenerlo presente al probar.

**Migración `004_rutinas_semanales.sql`.** Aplicada correctamente en la base local. Contiene:

- Tipo `routine_day_type` con los valores `training`, `rest` y `optional_rest`.
- `routines.weeks`, la duración del plan, entre 1 y 52 semanas.
- `routines.origin_routine_id`, el linaje de la rutina, con relleno inicial de las filas existentes apuntando a sí mismas.
- `routine_days.day_type` y `routine_days.mirrors_day_order`, más restricciones que obligan a que `day_order` sea una franja del 1 al 7 y que un día no se repita a sí mismo.
- `workout_sessions.week_number`.
- Tabla `workout_exercise_log`, una fila por ejercicio terminado dentro de una sesión.
- Relleno de `workout_exercise_log` a partir de las series ya registradas, para que el historial anterior se lea con las mismas reglas que el nuevo. Se crearon 10 filas de ejercicios históricos.

**Por qué se añadió el linaje.** Modificar una rutina archiva la versión anterior y crea una nueva, para no romper los entrenamientos ya registrados. Sin un enlace entre versiones, el progreso del atleta desaparecería de la vista cada vez que el entrenador ajustase el plan, lo cual sería inaceptable en un plan de seis semanas. `origin_routine_id` conserva esa relación y la consulta de progreso recorre todo el linaje. Limitación conocida: la rutina que el usuario ya tenía archivada antes de esta migración no puede enlazarse con su versión activa, porque esa relación nunca se guardó en ningún sitio y no es reconstruible con seguridad. Solo afecta a ese par preexistente; a partir de ahora el linaje se registra correctamente.

**Cambios en el backend.**

- `src/repositories/routines.repository.js`: `insertRoutine` acepta duración, tipo de día y día espejo, deriva `end_date` de la fecha de inicio y la duración —ya no se recibe del cliente, para que no puedan quedar incoherentes— y **copia en el servidor los ejercicios de un día espejo** cuando el cliente no envía lista propia. `replaceRoutine` propaga el linaje. Se añadieron `logExercise`, `unlogExercise` y `routineProgress`, y se reescribieron `startWorkout` y `finishWorkout`.
- `src/services/routines.service.js`: función `currentWeek`, que calcula en qué semana va el plan según su fecha de inicio sin pasarse de la duración; traducción de los errores del repositorio a respuestas HTTP; y el plegado de la cuadrícula de cumplimiento, que ante varias sesiones en la misma franja se queda con el mejor estado y el mayor avance.
- `src/routes/routines.routes.js`: el esquema de validación admite `weeks`, `dayType` y `mirrorsDayOrder`, y con `superRefine` comprueba reglas que dependen de varios días a la vez: un día libre no puede llevar ejercicios, un día de entrenamiento necesita al menos uno salvo que repita otro, y solo se puede repetir un día anterior de la misma semana que además no sea libre.
- `src/controllers/routines.controller.js`: puntos de entrada de las operaciones nuevas.

**Endpoints nuevos:** `PUT /api/routines/workouts/:id/exercises/:exerciseId` para marcar un ejercicio terminado, `DELETE` del mismo para desmarcarlo, y `GET /api/routines/:id/progress` para la cuadrícula de cumplimiento.

**Cierre automático del día.** Cuando queda marcado el último ejercicio, el servidor cierra el día solo. Al desmarcar uno, lo reabre. Marcar nunca reabre un día ya cerrado, porque el atleta pudo haberlo cerrado a propósito con menos ejercicios de los planificados. Un día libre no tiene ejercicios, así que queda cumplido en el instante en que el atleta lo marca, sin necesidad de un endpoint aparte.

**Corrección de seguridad pendiente desde el 12 de agosto: resuelta.** `startWorkout` comprueba ahora que el día pertenezca a una rutina activa del atleta, y las tres operaciones de registro comprueban que cada ejercicio pertenezca al día de la sesión. Se verificó con pruebas que ambos intentos devuelven 403.

**Compatibilidad con la interfaz actual.** La fase 1 no rompe el navegador: el formulario del entrenador sigue creando rutinas de un día (los valores por defecto de Zod rellenan lo nuevo) y la pantalla del atleta sigue registrando todo de una vez con `finish`, que ahora guarda las series de forma idempotente en lugar de duplicarlas.

**Verificaciones ejecutadas.**

- Se creó `test/weekly-routines.test.js`, la segunda prueba automatizada real del proyecto. **El total pasó de 1 prueba a 16, todas aprobadas.** Cubre: duración y fecha final derivada, los tres tipos de día, la copia del día espejo con filas propias, el rechazo de abrir un día ajeno, el rechazo de una semana fuera del plan, la reutilización de la sesión abierta, el rechazo de un ejercicio de otro día, el cierre automático al marcar el último ejercicio, el reemplazo de series al volver a guardar, la reapertura al desmarcar, el día libre cumplido al instante, la cuadrícula de cumplimiento y la conservación del progreso al modificar la rutina. Todos los datos temporales se eliminan al terminar y la limpieza se comprueba.
- Se ejecutó además una comprobación temporal **de extremo a extremo por HTTP real** contra el servidor levantado, con cuentas registradas por la propia API y vinculadas mediante invitación. Verificó lo que la prueba de servicio no alcanza: el cableado de las rutas, los nombres de los parámetros del controlador y los valores por defecto de Zod. Los 21 controles pasaron, incluido que un entrenador ajeno recibe 404 al intentar ver el progreso de una rutina que no es suya. Las tres cuentas temporales se eliminaron al terminar.
- Se comprobó que los datos reales existentes siguen leyéndose bien con el modelo nuevo: la rutina activa del usuario quedó como plan de una semana con su día como día de entrenamiento, y la cuadrícula de progreso responde sobre ella.
- `node --check` sobre los cuatro módulos modificados, `npm.cmd run format:check` conforme en todo el proyecto, `git diff --check` sin errores y `/api/health` respondiendo `{"status":"ok"}` con el servidor levantado.

**Pendiente de esta fase.** No hay nada que revisar visualmente todavía, porque la fase 1 no cambia ninguna pantalla; eso llega con las fases 2 y 3. Sí queda anotado que **ahora hay dos migraciones sin aplicar en Neon**: `003_exercise_status.sql`, pendiente desde el 11 de agosto, y `004_rutinas_semanales.sql`. Ninguna versión nueva debe publicarse en Render sin aplicarlas antes.

#### Fase 2 terminada: constructor semanal del entrenador

**Convenciones confirmadas antes de escribir nada.** Se revisaron las convenciones vigentes del frontend para que el código nuevo encajara con el resto: `icon(name, size)` devuelve una cadena de HTML y **no avisa cuando el nombre no existe**, simplemente devuelve vacío; los puntos de quiebre son 1024 px y 640 px; las pantallas dibujan con plantillas de texto y vuelven a enlazar los manejadores con `button.onclick` después de cada redibujado; y **la clase `.tab` ya está ocupada por la barra inferior de navegación**, por lo que reutilizar ese nombre habría roto el menú móvil.

**Iconos nuevos.** `public/js/comun/icons.js` no tenía símbolo de sumar (`mas` son tres puntos, del menú "Más"), ni papelera, ni copia, ni calendario. Se añadieron `agregar`, `basura`, `copiar` y `calendario`, con el mismo trazo y estilo que los veinte existentes.

**La pantalla.** `public/entrenador/rutina-formulario.html` se rehízo en dos tarjetas: los datos del plan, con la duración como control segmentado, y la semana, con la tira de los siete días y el editor del día seleccionado debajo. La plantilla de fila de ejercicio se conservó, con límites añadidos coherentes con los que valida el servidor.

**El estado vive ahora en JavaScript.** Es la única pantalla del proyecto donde el estado no se lee del DOM, y fue una decisión obligada: como solo se dibuja el día seleccionado, los otros seis no existen en pantalla y no se podrían leer al guardar. El DOM se vuelca al estado con `captureCurrentDay()` antes de cualquier redibujado. Queda explicado en el comentario de cabecera del archivo para que no parezca una inconsistencia.

**Comportamiento del constructor.**

- La semana nace con el Día 1 como entrenamiento y los seis restantes como día libre, de modo que el entrenador solo marca lo que de verdad se entrena.
- Cada ficha de la tira muestra su estado de un vistazo: número de ejercicios, `Libre`, `Libre opcional` o `Igual al Día N`. Un día de entrenamiento todavía vacío se marca en ámbar, porque el servidor rechazaría la rutina si se guardara así.
- Los días espejo se sincronizan mientras se edita: como los ejercicios de un día espejo se resuelven desde el día que repite en el momento de dibujar, cambiar el Día 1 actualiza al instante lo que muestra el Día 4.
- Solo se ofrecen como origen los días de entrenamiento anteriores con lista propia. Encadenar espejos complicaría la pantalla sin aportar nada.
- Al convertir en día libre un día que otros repetían, esos días sueltan la referencia automáticamente, porque ya no habría nada que copiar.
- La duración se elige con atajos de 1, 4, 6 y 8 semanas más una opción `Otro` que descubre un campo numérico.
- Antes de enviar se comprueba que ningún día de entrenamiento quede sin ejercicios ni día espejo; si lo hay, se abre ese día y se explica qué falta, en vez de dejar que el servidor devuelva un error genérico.

**Un fallo evitado a propósito.** El catálogo de ejercicios solo devuelve los activos. Si una rutina que se está editando usaba un ejercicio que después se desactivó, el desplegable no lo habría contenido y **al guardar se habría perdido en silencio**. El constructor añade ese ejercicio como opción marcada `no disponible` para conservarlo.

**Lista y detalle del entrenador.** `public/js/entrenador/rutinas.js` muestra ahora la duración del plan como etiqueta, y en el detalle cada día aparece con su número, su nombre y una etiqueta que indica si es libre, libre opcional o copia de otro día. Cuatro semanas se escriben como `4 semanas (1 mes)`, que es como lo diría una persona.

**Estilos nuevos** en `public/css/components.css`: `.day-tabs` y `.day-tab`, la tira de días que en pantalla ancha muestra las siete a la vez y en móvil se desplaza en horizontal con anclaje; `.day-tab-icon`, la pastilla circular que se rellena de color al seleccionar; y `.segmented` con `.segmented-option`, el control segmentado reutilizable. Todo con los tokens ya existentes y con estados de foco visibles.

**Verificaciones ejecutadas.**

- Comprobación temporal del contrato entre HTML, JavaScript y CSS: los identificadores que busca el JavaScript existen en la página, los campos por `name`, los `data-name` de la plantilla de fila, que las seis clases nuevas tengan estilo, que **no se reutilice el nombre `.tab`**, que los cuatro iconos usados existan de verdad en `icons.js`, que el HTML no traiga atributos `style` (la CSP los bloquea) y que sigan enlazadas las tres hojas y el script de tema. Los trece controles pasaron. La primera ejecución dio un falso positivo, porque la propia comprobación se detectó dentro de un comentario del CSS; se corrigió quitando los comentarios antes de la búsqueda.
- Comprobación temporal **de ida y vuelta contra la API real**, construyendo exactamente el mismo cuerpo que arma el formulario: una semana de siete franjas con entrenamiento, día libre, día libre opcional y un día espejo. Los 18 controles pasaron, incluidos que las siete franjas vuelven con sus tipos correctos, que el día espejo copió los ejercicios en filas propias, que el detalle trae todas las claves que el formulario necesita para recargar, y que **al añadir un ejercicio al Día 1 y volver a guardar, el Día 4 que lo repite pasó también a tener tres ejercicios**. Las cuentas temporales se eliminaron al terminar.
- `node --check` sobre los tres módulos tocados, `npm.cmd run format:check` conforme, `git diff --check` sin errores, las 16 pruebas automatizadas siguen pasando sin regresiones, y las seis páginas y recursos implicados responden 200 con el servidor levantado.

**Pendiente de esta fase.** Falta la confirmación visual del usuario en el navegador: crear una rutina semanal desde cero, marcar días libres, hacer que un día repita a otro y comprobar que se sincroniza al editar el original, cambiar la duración, guardar, y volver a abrir la rutina para editarla y verificar que todo vuelve como estaba. La pantalla del atleta todavía no sabe nada de días libres ni de marcar ejercicios de a uno: eso es la fase 3.

#### Repaso de la vista móvil del constructor

El usuario revisó la fase 2 y señaló dos cosas. La primera, que **en el celular la pantalla no se ve bien**, aunque en portátil y tableta sí. Al preguntarle qué era lo que peor se veía marcó las cuatro opciones: la tira de los siete días, los controles redondeados, la sensación general de agobio y los campos del formulario. Es decir, un repaso móvil completo de la pantalla, no un retoque.

La segunda fue preguntar si **el guardado del progreso del atleta ya estaba hecho**. Se le respondió con precisión: el backend sí (fase 1, con pruebas), pero **la pantalla del atleta no lo usa todavía**, así que como funcionalidad de producto no está entregada; sigue con el registro de todo al final. Eso es la fase 3, que el usuario pidió hacer justo después de arreglar el móvil.

**Diagnóstico.** Los tres defectos tenían causa concreta en el CSS escrito en la fase 2:

- La tira de días se había hecho con desplazamiento horizontal y un mínimo de 116 px por ficha, unos 860 px en total. En un teléfono de 390 px solo se veían tres días y había que arrastrar hasta el Día 7; además el texto de estado a 11 px se partía en varias líneas y dejaba las fichas desparejas. Encima el desplazamiento se recortaba contra el relleno de la tarjeta en vez de llegar al borde de la pantalla.
- Los controles redondeados eran un control segmentado en forma de cápsula usado también para la duración, que tiene cinco opciones. En un teléfono no caben en una fila, así que se apilaban dentro de la cápsula y **una píldora con dos o tres líneas de contenido se deforma**: eso era lo de las esquinas raras.
- La fila de ejercicio apilaba cuatro campos a ancho completo más un botón rojo de quitar, así que cada ejercicio ocupaba una pantalla entera y una rutina de cinco se volvía interminable.

**Decisiones tomadas.**

- **La tira ya no se desplaza.** Los siete días caben siempre en una fila, porque una semana se entiende de un vistazo o no se entiende. En móvil la ficha lleva solo el icono y `D3`; a partir de 900 px recupera `Día 3` y su línea de estado. El estado del día abierto se lee en una cabecera nueva del editor, justo debajo, así que en pantalla pequeña no se pierde información. Toda la lógica responsiva quedó en CSS, sin `matchMedia` en JavaScript, y el estado completo va además en `aria-label` para que un lector de pantalla lo oiga en cualquier tamaño.
- **Dos controles distintos según el número de opciones.** El tipo de día (tres opciones excluyentes) sigue siendo un control segmentado, ahora con columnas iguales, texto que puede ocupar dos líneas y forma de rectángulo redondeado en móvil, que es lo que no se deforma; a partir de 640 px recupera la píldora. La duración (cinco opciones) pasó a fichas sueltas `.chip`, que se reparten en las líneas que hagan falta sin romper ninguna cápsula.
- **La fila de ejercicio se compactó.** Cabecera con `Ejercicio 1` y un botón de icono para quitar en la esquina, en lugar del botón rojo a ancho completo; el ejercicio ocupa el ancho completo y series, repeticiones y descanso comparten la fila siguiente, que baja a dos columnas solo en pantallas muy estrechas. Las filas se renumeran al añadir y al quitar, para que no queden huecos tras borrar la del medio.

**Archivos tocados:** `public/css/components.css`, `public/entrenador/rutina-formulario.html`, `public/js/entrenador/rutina-formulario.js`. No se tocó nada de `src`, ni la API, ni la base de datos.

**Verificaciones ejecutadas.** La comprobación temporal del contrato HTML/JavaScript/CSS se amplió a 20 controles, todos correctos: además de lo anterior comprueba que las trece clases nuevas tengan estilo **y se usen de verdad** (un cambio de nombre a medias dejaría el control sin estilo sin dar ningún error), que la tira ya no use desplazamiento horizontal y sí reparta siete columnas, que la duración use fichas y el tipo de día siga segmentado, y que el botón de quitar tenga etiqueta accesible. Se repitió también la comprobación de ida y vuelta contra la API, con sus 18 controles en verde, para confirmar que rehacer la plantilla de fila no rompió la lectura de los datos. `npm.cmd run format:check` conforme, `git diff --check` limpio, las 16 pruebas automatizadas siguen pasando y las páginas y recursos responden 200 con el código nuevo ya servido.

**Nota sobre el entorno.** Al intentar levantar un servidor para verificar apareció `EADDRINUSE`: el puerto 3000 ya estaba ocupado por el servidor del propio usuario, levantado con `npm run dev`. Como ese modo usa `node --watch`, ya tenía el código actual y las comprobaciones se ejecutaron contra él sin problema. **No se detuvo ese proceso**, para no interrumpir la revisión del usuario.

**Pendiente.** Confirmación visual en un teléfono real de las tres correcciones, y después la fase 3.

El usuario confirmó que la vista móvil ya le gusta y detuvo su servidor local para dejar el puerto libre. Se pasó a la fase 3.

#### Fase 3 terminada: la pantalla del atleta

**Un hueco del backend detectado antes de empezar.** La fase 1 permitía marcar ejercicios, pero **no había forma de recuperar lo ya marcado al volver a un día**. Peor: `startWorkout` solo reutilizaba sesiones sin terminar, así que **volver a un día ya cumplido habría creado una sesión nueva vacía** y el atleta habría visto cero de cinco después de haberlo completado, además de dejar una franja duplicada en la semana. Se corrigieron ambas cosas antes de tocar la interfaz:

- `startWorkout` reutiliza ahora la sesión de la franja **esté terminada o no**. Una franja de la semana es una sola sesión.
- Se añadió `loggedExercises()`, que devuelve qué ejercicios se dieron por terminados y con qué series, y su resultado viaja en la respuesta de `startWorkout`. Sin eso la pantalla no podría mostrar lo hecho ni recuperar los números escritos.

Se añadieron dos pruebas automatizadas para ese comportamiento: que reabrir un día cumplido devuelve la misma sesión sin crear una repetida, y que se recuperan los ejercicios marcados con sus series. **El total pasó de 16 a 18 pruebas.**

**Decisión de diseño: mirar un día no es empezarlo.** La pantalla solo abre sesión en el servidor cuando el atleta pulsa `Comenzar día` o `Marcar como cumplido`, o cuando la franja ya tenía una sesión de antes. Si cada día que se toca abriera sesión, navegar por la semana dejaría entrenamientos a medias en el historial y en la vista del entrenador. La cuadrícula de progreso, que ya se pide al abrir la rutina, es la que dice si una franja tiene sesión.

**La pantalla.** `public/js/atleta/rutinas.js` se reescribió por completo:

- Cabecera con el nombre del plan y, si dura más de una semana, un navegador `‹ Semana 2 de 6 ›`. La semana de partida es la que calcula el servidor a partir de la fecha de inicio.
- Fila de siete **anillos de progreso**: el trazo se rellena según los ejercicios hechos, con una marca de verificación al completar, una luna en los días libres pendientes y el número del día en los demás. Igual que en el constructor, los siete caben siempre en una fila y a partir de 900 px la etiqueta pasa de `D3` a `Día 3`.
- Al elegir un día de entrenamiento sin empezar se ve el plan en modo consulta, con instrucciones y videos, y un botón `Comenzar día`.
- Una vez empezado, cada ejercicio es una tarjeta con sus filas de serie (repeticiones, peso y casilla de dolor) y un botón `Marcar como hecho`. Al marcarlo la tarjeta se tiñe de verde, se resume lo registrado y solo queda `Deshacer`. Arriba, una barra de avance con `3 de 5 ejercicios`.
- Los días libres muestran su explicación y un único botón para darlos por cumplidos.
- Al final, un bloque opcional para anotar energía y notas y cerrar el día aunque falte algún ejercicio.

**Se puede marcar un ejercicio sin anotar los números.** Las filas vacías se descartan al enviar, y la API acepta una lista de series vacía. Un atleta que solo quiere ir tachando lo hecho puede hacerlo sin teclear nada.

**Deshacer no borra lo escrito de la pantalla.** El servidor sí elimina las series al desmarcar —desmarcado significa no hecho—, pero la pantalla guarda aparte los últimos números tecleados y vuelve a mostrarlos en las casillas. Deshacer por error no obliga a escribirlo todo otra vez.

**Restricción respetada: nada de estilos en línea.** La política de seguridad del servidor bloquea los atributos `style`, así que el avance del anillo va en atributos del SVG (`stroke-dasharray` y `stroke-dashoffset`) y la barra de progreso es un elemento `<progress>` nativo con su valor en un atributo. Es la misma razón por la que en el rediseño del 12 de agosto hubo que quitar todos los `style=`.

**Archivos tocados:** `src/repositories/routines.repository.js`, `test/weekly-routines.test.js`, `public/atleta/rutinas.html`, `public/js/atleta/rutinas.js`, `public/css/components.css` y `public/js/comun/icons.js`, donde se añadieron los iconos `anterior`, `siguiente` y `deshacer`.

**Verificaciones ejecutadas.**

- Comprobación temporal **de todo el recorrido del atleta por HTTP real**, reproduciendo las mismas llamadas y en el mismo orden que hace la pantalla. Los 30 controles pasaron: la semana actual se calcula sola (un plan empezado hace ocho días abre en la semana 2), mirar la semana no deja entrenamientos a medias, comenzar abre la sesión en la semana correcta, marcar el último ejercicio cierra el día solo, volver al día recupera los dos ejercicios con sus series y hasta la casilla de dolor, deshacer reabre el día, el día libre se cumple al marcarlo, cerrar con energía y notas funciona aunque falte un ejercicio, **la semana 1 sigue intacta mientras se registra la 2**, el entrenador ve el mismo progreso y el entrenamiento aparece en el historial.
- Comprobación temporal del contrato de la pantalla, 13 controles: identificadores, que **ni el HTML ni las plantillas del JavaScript generen atributos `style`**, que el anillo use atributos SVG y la barra un `<progress>`, que las 21 clases nuevas tengan estilo y se usen, que los cinco iconos existan de verdad, y que los textos que vienen del servidor se escapen antes de insertarlos.
- Las 18 pruebas automatizadas pasan, `npm.cmd run format:check` conforme, `git diff --check` limpio y las páginas del atleta responden 200.

**Pendiente de esta fase.** Confirmación visual del usuario en el navegador y en el teléfono: abrir una rutina, moverse entre semanas, comenzar un día, marcar ejercicios de a uno y ver cómo se llena el anillo, deshacer, completar un día entero y comprobar que queda con su marca, y marcar un día libre. Después queda la **fase 4**: que el entrenador vea el cumplimiento de cada atleta con el mapa de semanas por días y el resumen en la lista de atletas. Y siguen pendientes de aplicar en Neon las migraciones `003` y `004` antes de publicar en Render.

### Los videos de YouTube no se reproducían dentro de la aplicación

El usuario informó de que al abrir el video de un ejercicio aparecía un error y tenía que ir a YouTube directamente. Pidió que se pudiera ver dentro de la aplicación.

**Diagnóstico, descartando causas una a una.**

1. Se revisó la política de seguridad de contenido en `src/app.js`: `frameSrc` **sí** autoriza `youtube.com`, `youtube-nocookie.com` y `player.vimeo.com`. No era eso.
2. Se consultó qué enlace había guardado de verdad en la base local. Es `https://www.youtube.com/watch?v=WDIpL0pjun0`, del ejercicio `Lagartijas`; una dirección estándar que el conversor sí reconocía. Tampoco era un problema de formato.
3. Se comprobó contra YouTube que el video existe y es público (oEmbed respondió 200) y, sobre todo, que **`"playableInEmbed":true`**: su autor no ha desactivado la incrustación. Eso descartaba la única causa que no habríamos podido arreglar.
4. Se inspeccionaron las cabeceras reales que devuelve el servidor y apareció la causa: **Helmet envía `Referrer-Policy: no-referrer` para toda la aplicación**. Sin cabecera `Referer`, el reproductor de YouTube no puede comprobar desde qué sitio se le está incrustando y responde con un error en lugar del video.

**Corrección aplicada.** Se añadió `referrerpolicy="strict-origin-when-cross-origin"` **al propio marco del video**. El atributo del elemento manda sobre la cabecera del documento, así que la política estricta se conserva para toda la aplicación y solo se relaja en esa petición concreta, y únicamente hasta el origen: YouTube recibe `http://localhost:3000` o la dirección pública, nunca la ruta de la página que estaba viendo el atleta. Se descartó a propósito cambiar la cabecera global, que habría debilitado la protección de todo el sitio para arreglar un caso.

**Mejoras aprovechando el cambio.**

- La conversión de enlaces se sacó a un módulo propio, `public/js/comun/video.js`, sin nada del navegador. Antes vivía dentro de la pantalla del atleta y por eso **no se podía probar**: importarla arrastraba `navigation.js` y el DOM.
- Se ampliaron los formatos admitidos. Antes solo se reconocían `watch?v=` y `youtu.be`; ahora también **`/shorts/`**, `/live/`, `/embed/` y los enlaces de `youtu.be` con el parámetro `?si=` que añade el botón Compartir. Los Shorts son hoy el formato más habitual y hasta ahora el atleta no veía nada al pulsar `Ver video`.
- Se validan el esquema y la forma del identificador, de modo que un `javascript:` o un `data:` nunca puedan acabar en el `src` de un marco.
- Bajo el reproductor hay ahora un enlace permanente `¿No se ve? Ábrelo en YouTube`. Si el autor de un video concreto sí tiene desactivada la incrustación, eso no se puede arreglar desde aquí, y conviene que la salida esté siempre a la vista.

**Verificaciones.** Se creó `test/video-embed.test.js` con cuatro pruebas que cubren las nueve formas de enlace de YouTube, Vimeo, lo que debe rechazarse y los esquemas peligrosos. **El total pasó de 18 a 22 pruebas.** `npm.cmd run format:check` conforme, la comprobación del contrato de la pantalla del atleta sigue en verde, y se confirmó sobre el servidor levantado que `/js/comun/video.js` se sirve y que el marco sale con el `referrerpolicy` correcto.

**Pendiente.** Confirmación del usuario de que el video ya se reproduce dentro de la aplicación. Si aún fallara, el siguiente paso sería comprobar en las herramientas del navegador si el error lo da YouTube dentro del marco o si el marco ni siquiera carga.

El usuario confirmó que **el video ya se reproduce dentro de la aplicación**. El problema queda cerrado.

## Estado al cerrar el 14 de agosto de 2026

Se revisó el estado real del repositorio para dejarlo anotado con exactitud. Durante el día el usuario confirmó por su cuenta el commit `441805d` (`Arreglando los files para que sea legible todo`), que corresponde al trabajo del 13 de agosto: tema oscuro predeterminado y legibilidad de todo el JavaScript. Aquella anotación de esta bitácora que decía que el último commit era `701ec18` quedó desfasada por ese motivo.

**Trabajo del día ya confirmado en Git.** El usuario creó dos commits, `a69dc19` (`Adding rutinas y entrenador changes and youtube`) y `1c91e86` (`adding phase4`). Se comprobó que el árbol de trabajo quedó limpio y que los cuatro archivos que antes ni siquiera estaban rastreados ya forman parte del repositorio: `database/migrations/004_rutinas_semanales.sql`, `public/js/comun/video.js`, `test/video-embed.test.js` y `test/weekly-routines.test.js`. El trabajo del 14 de agosto está respaldado.

### Lo que sí quedó terminado hoy

- Fase 1: modelo semanal en base de datos y API, con guardado del cumplimiento ejercicio por ejercicio y cierre automático del día. Incluyó la corrección del fallo de autorización pendiente desde el 12 de agosto.
- Fase 2: constructor semanal del entrenador, con los siete días, días libres, días espejo sincronizados y duración del plan.
- Repaso completo de la vista móvil del constructor.
- Fase 3: pantalla del atleta con anillos de progreso, marcado ejercicio por ejercicio y navegación entre semanas.
- Reproducción de videos de YouTube dentro de la aplicación.
- Las pruebas automatizadas pasaron de **1 a 22** en un solo día.

### Fase 4 terminada: el entrenador ve el cumplimiento

Con esto queda completo el bloque de rutinas semanales acordado al empezar el día.

**Endpoint nuevo `GET /api/routines/compliance`**, solo para entrenadores. Devuelve, por cada atleta vinculado, su rutina activa y cómo va en la semana en curso. Detalles de la implementación:

- La consulta usa `DISTINCT ON` para quedarse con la rutina activa más reciente cuando un atleta tiene varias, y un `LEFT JOIN` para que **los atletas sin rutina aparezcan igual** en la lista, con su aviso, en lugar de desaparecer.
- La semana en curso se calcula en el servicio con `currentWeek`, la misma función que usa el resto de la aplicación, en vez de repetir la regla dentro del SQL. Duplicar una regla de negocio en dos sitios es pedir que se separen con el tiempo.
- El recuento de días cumplidos se resuelve **en una sola consulta para todos los atletas**, pasando dos listas en paralelo con `unnest`, en lugar de lanzar una consulta por atleta.

**Decisión: los días libres no cuentan.** El resumen dice `3 de 5 días` contando solo los días de entrenamiento. Incluir los días libres inflaría el cumplimiento con jornadas en las que no había nada que hacer, y un atleta que solo marcase descansos aparecería como cumplidor.

**Mapa de cumplimiento en el detalle de la rutina.** Al pulsar `Ver rutina`, el entrenador ve ahora una cuadrícula de semanas por días donde cada celda está coloreada: cumplido, a medias, sin empezar o día libre. De un vistazo se ve en qué semana abandonó el atleta, que es justo lo que hay que saber para ajustar el plan. Cada celda lleva su texto en `title` y en un texto solo para lectores de pantalla. Un día libre sin registrar se dibuja con borde discontinuo en vez de marcarse como pendiente: no haber registrado un descanso no es un incumplimiento.

**Una petición menos.** La pantalla pasó a pedir `GET /api/routines/:id/progress`, que ya devuelve la rutina completa además de la cuadrícula, en lugar de pedir la rutina por un lado y el progreso por otro.

**Resumen en la lista de atletas.** Se añadió la columna `Esta semana`, con el recuento de días y la semana del plan. El color es verde solo al completar la semana y ámbar si el atleta no ha empezado; el estado intermedio se deja neutro a propósito, para no regañar a nadie por ir a mitad de semana.

**Archivos tocados:** `src/repositories/routines.repository.js`, `src/services/routines.service.js`, `src/controllers/routines.controller.js`, `src/routes/routines.routes.js`, `public/js/entrenador/rutinas.js`, `public/js/entrenador/atletas.js`, `public/entrenador/atletas.html`, `public/css/components.css` y `test/weekly-routines.test.js`.

**Dos errores propios corregidos durante la verificación.** Las dos primeras pruebas del resumen fallaron, y en ambos casos el fallo estaba en la prueba y no en el código:

1. Se esperaba un día cumplido y salía cero. El plan de la prueba empieza el 3 de agosto, así que **la semana en curso es la 2**, mientras que las sesiones anteriores se habían registrado en la 1. El resumen acertaba. Además la expectativa dependía de la fecha en que se ejecutara la prueba, así que se rehízo para calcular la semana en curso y completar un día dentro de ella, quedando independiente del calendario.
2. La segunda prueba creaba un segundo entrenador que chocaba en el correo con el primero, porque el ayudante lo componía solo con el rol y una marca de tiempo común. Se le añadió un sufijo.

**Verificaciones ejecutadas.**

- Dos pruebas automatizadas nuevas: que el resumen cuenta solo los días de entrenamiento y que no incluye atletas de otro entrenador. **El total pasó de 22 a 24 pruebas.**
- Comprobación temporal por HTTP con 16 controles, todos correctos: que **la ruta `/compliance` no la captura `/:id`** (por eso se registra antes), que un atleta recibe 403 al pedir el resumen, que un atleta sin rutina aparece igual, que la semana en curso se calcula bien, que un día libre cumplido no infla la cuenta, que **lo cumplido en la semana 3 no suma en la semana 1**, que un entrenador ajeno no ve nada, y que `progress` devuelve rutina y cuadrícula para pintar el mapa de una sola vez.
- Comprobación del contrato de las dos pantallas, 9 controles: clases con estilo y en uso, los cuatro estados del mapa definidos, **que el `colspan` de la fila vacía coincida con las cinco columnas** y que cada fila tenga tantas celdas como cabeceras, escapado de nombres y ausencia de atributos `style`.
- `npm.cmd run format:check` conforme, `git diff --check` limpio y las páginas implicadas responden 200.

**Pendiente de esta fase.** Confirmación visual del usuario: abrir una rutina como entrenador y revisar el mapa, y mirar la columna `Esta semana` en la lista de atletas.

### Pendientes, en orden recomendado

**1. Confirmar en Git el trabajo del día.** ✅ Hecho: commits `a69dc19` y `1c91e86`.

**2. Cadena de despliegue.** ✅ Neon ya está migrada (ver más abajo). Queda publicar en Render el código de hoy y hacer la prueba de humo del recorrido en producción.

**3. Ampliar las pruebas automatizadas.** Las 24 actuales cubren cambio de contraseña, rutinas semanales y enlaces de video. Sigue sin haber cobertura de autenticación y roles, invitaciones y vinculaciones, aislamiento de los datos entre atletas, y mensajería.

**4. Endurecimiento antes de datos reales.** No hay token CSRF explícito: la protección se apoya solo en `sameSite=lax`. Faltan también recuperación de contraseña y verificación de correo.

**5. Funciones del MVP que siguen sin existir.** Las fotografías de progreso tienen su tabla pero no hay almacenamiento de archivos ni interfaz. La tabla de notificaciones **no está conectada a ningún evento** del código de `src`. No existe la ficha individual del atleta (`atleta-detalle.html`), que sí estaba en el diseño original, ni un formulario para que el entrenador registre medidas. Tampoco hay duplicar ni archivar rutinas desde la interfaz.

**6. Cabos sueltos menores.** `multer` sigue declarado en `package.json` **sin usarse en ningún archivo de `src`**. Persiste la advertencia de `pg`/`pg-connection-string` sobre los modos SSL, que conviene resolver haciendo explícito `sslmode=verify-full` antes de actualizar a `pg` 9. El `README.md` documenta unas cuentas demo (`entrenador@demo.local` y `atleta@demo.local`) que **no existen en la base que el proyecto usa de verdad**, la de Neon: allí nunca se ejecutó el seed, y ahora además el guardarraíl lo impide. Esas credenciales confunden más que ayudan y conviene sustituirlas por una nota explicando que cada quien crea su cuenta desde el registro. Y la rutina que quedó archivada antes de la migración `004` no puede enlazarse con su versión activa, porque esa relación nunca se guardó; solo afecta a ese par preexistente.

## Descubrimiento importante: se estuvo trabajando contra la base de producción

Al terminar la fase 4, el usuario dijo haber aplicado las migraciones en Neon. Antes de darlo por bueno se comprobó el estado real, y apareció algo que ninguno de los dos esperaba.

### Qué pasó

**El archivo `.env` apuntaba a Neon, no a PostgreSQL local**, y llevaba así varios días. La bitácora afirmaba desde el 9 de agosto que «la conexión local conservada en `.env` no debe reemplazarse»; eso dejó de ser cierto en algún momento y nadie actualizó el documento. Ese dato viejo indujo a error durante toda la jornada.

Las marcas de tiempo de `schema_migrations` en Neon lo dejaron claro:

| Migración | Aplicada en Neon |
|---|---|
| `001_initial_schema.sql` y `002_seed_exercises.sql` | 10 de agosto, 03:55 |
| `003_exercise_status.sql` | 12 de agosto, 03:42 |
| `004_rutinas_semanales.sql` | **14 de agosto, 18:14** |

Esas 18:14 corresponden al `npm run db:migrate` ejecutado al comenzar la fase 1, creyendo que iba contra la base local. Cuando el usuario ejecutó el comando por su cuenta hacia las 20:20, ya estaba todo aplicado y por eso no vio nada raro.

La consecuencia es que **todo el trabajo del 14 de agosto se hizo contra la base de datos de producción**, incluidas las pruebas automatizadas y las comprobaciones temporales por HTTP, que crean y eliminan usuarios, rutinas y sesiones.

### Daños: ninguno, pero por higiene y no por diseño

Se auditó Neon y quedó limpia: **cero usuarios de prueba** de los prefijos `rutina-`, `http-`, `rt-`, `f3-` y `f4-`, ninguna invitación huérfana, y solo las dos cuentas reales del usuario con sus tres rutinas y once sesiones, incluida `Rutina_Agosto_2026`, creada a las 18:44 probando el constructor semanal nuevo. Cada comprobación temporal borraba lo suyo al terminar y verificaba el número de filas eliminadas, lo que evitó el problema. Aun así, el resultado dependió de esa disciplina y no de una separación real de entornos.

### Estado confirmado de Neon

Migrada por completo: las cuatro migraciones registradas, 21 tablas, las columnas `routines.weeks`, `routines.origin_routine_id`, `routine_days.day_type`, `routine_days.mirrors_day_order` y `workout_sessions.week_number`, y la tabla `workout_exercise_log`. El punto 2 de los pendientes queda resuelto en su parte de base de datos.

### Decisión final: se trabaja contra Neon, a propósito

Hubo un primer intento de separar los entornos. Se le plantearon tres opciones al usuario y en un principio eligió volver a la base local, así que se reescribió `.env` con la conexión local y la de Neon comentada como respaldo.

**Ese cambio no llegó a aplicarse.** El usuario tenía `.env` abierto en el editor desde antes, con la versión anterior en memoria, y al guardar sobrescribió el archivo reescrito. Se comprobó y `.env` había vuelto exactamente a su estado previo. Conviene recordarlo: **editar un archivo que la otra parte tiene abierto en el IDE se pierde en cuanto esa persona guarda**; si hay que tocar un archivo así, es mejor que lo edite quien lo tiene abierto.

Al explicárselo, el usuario decidió **dejarlo apuntando a Neon**, que es como ha venido trabajando. La decisión se respeta: sus datos reales están allí y es su proyecto. Queda por tanto establecido que, salvo que se diga lo contrario:

- El desarrollo local y las pruebas automatizadas usan **la misma base que el sitio publicado**.
- `npm test` escribe y borra en esa base. Las pruebas actuales crean usuarios temporales con prefijos propios y comprueban el número de filas eliminadas al limpiar, pero **cualquier prueba nueva debe mantener esa disciplina**: acotar siempre los borrados a sus propios datos y verificar el recuento.

### Protección añadida a los datos demo

El comando verdaderamente peligroso en este escenario era `npm run db:seed`: crea las cuentas `entrenador@demo.local` y `atleta@demo.local`, su vinculación y su conversación, y ejecutado contra Neon habría mezclado usuarios falsos entre los reales.

Se añadió un guardarraíl en `database/seed.js`: lee el `hostname` de la conexión y, si no es `localhost` ni `127.0.0.1`, se detiene explicando por qué en lugar de sembrar nada. Para forzarlo hay que pedirlo a propósito con `SEED_ALLOW_REMOTE=true`. Se comprobó en ejecución real: con la conexión actual el comando se detiene y no escribe.

No se puso un guardarraíl equivalente en `npm test`, porque bloquearlo dejaría al usuario sin poder ejecutar las pruebas en absoluto, que sería peor que el riesgo que evita.

### Regla que queda establecida

**Antes de tocar datos, comprobar a qué base apunta `.env`; no fiarse de lo que diga este documento.** Un dato de configuración escrito en la bitácora envejece en cuanto alguien cambia el archivo, y este caso demuestra que el documento puede llevar días equivocado sin que se note. La comprobación es inmediata y no expone secretos: basta con leer el `hostname` de `DATABASE_URL`.

## Bloque nuevo acordado: cuatro fases

Terminado el bloque de rutinas semanales, el usuario pidió profundizar en las funciones del MVP que nunca se construyeron y, tras revisarlas una por una en el código, acordó este orden:

1. **Ficha individual del atleta.**
2. **Duplicar rutinas.**
3. **Notificaciones.**
4. **Fotos de progreso.**

Se dejaron las fotos para el final porque son las que exigen una decisión de infraestructura: el disco de Render se borra en cada despliegue, así que necesitan almacenamiento de objetos externo, y además son datos corporales que piden un control de acceso cuidadoso.

Durante esa revisión se corrigió un dato que se había dado por bueno: **la API ya permitía al entrenador registrar mediciones de sus atletas**. `POST /api/tracking/measurements` acepta un `athleteId` y `authorizedAthlete` comprueba el vínculo activo antes de aceptar. Lo que faltaba era solo el formulario.

### Fase 1 terminada: ficha individual del atleta

**El problema que resuelve.** La información del entrenador estaba organizada por función y no por persona: rutinas en una pantalla, check-ins en otra, nutrición en otra. Para responder «¿cómo va Andrés?» había que recorrer cuatro pantallas filtrando mentalmente, y la lista de atletas era una tabla plana donde **no se podía pulsar sobre nadie**.

**Sin cambios en el servidor.** Se comprobó endpoint por endpoint que todo lo necesario ya existía: `GET /api/links/people` para la cabecera, `GET /api/routines` filtrando por `athlete_id` y `status`, `GET /api/routines/:id/progress` para la rutina y su mapa, `GET /api/tracking/measurements?athleteId=` que ya aceptaba el filtro y valida el vínculo, y los listados de check-ins y nutrición, que devuelven todo lo del entrenador y se filtran en la pantalla. La fase resultó ser exclusivamente de interfaz.

**El mapa de cumplimiento se extrajo a un módulo compartido.** Lo necesitaban la pantalla de rutinas y la ficha nueva, y duplicar sesenta líneas habría condenado a las dos vistas a separarse con el tiempo. Se creó `public/js/comun/cumplimiento.js` con `renderCompliance`, y `public/js/entrenador/rutinas.js` pasó de 222 a 133 líneas al quitarle la copia local.

**Qué muestra la ficha.** Cabecera con nombre, correo y fecha de vinculación; tres indicadores —cumplimiento de la semana, último peso y check-ins sin responder—; la rutina activa con su mapa de cumplimiento y acceso directo a modificarla; las gráficas de peso y cintura con el historial completo; los cinco check-ins más recientes marcados como respondidos o pendientes; y el plan de nutrición con sus macros.

**Decisión: es una vista de conjunto, no un duplicado.** Los check-ins y la nutrición se muestran en resumen y enlazan a sus pantallas completas, que es donde viven esas conversaciones. Duplicar aquí el flujo de responder un check-in habría creado dos sitios que mantener. La única acción que se hace desde la ficha es **registrar una medición**, porque era justo la que no existía en ninguna parte.

**Detalle de interfaz.** En la pantalla del atleta cada gráfica es una tarjeta suelta, pero aquí ya están dentro de una, así que anidar tarjetas habría recargado el bloque. Se añadió `.chart-panel`, un panel más ligero para gráficas que viven dentro de una tarjeta.

**Archivos:** se crearon `public/entrenador/atleta-detalle.html`, `public/js/entrenador/atleta-detalle.js` y `public/js/comun/cumplimiento.js`; se modificaron `public/js/entrenador/rutinas.js`, `public/js/entrenador/atletas.js` —el nombre de cada atleta es ahora un enlace a su ficha— y `public/css/components.css`.

**Verificaciones ejecutadas.**

- Comprobación temporal por HTTP con 18 controles, todos correctos: que `people` traiga los campos de la cabecera, que **el entrenador pueda registrar una medición de su atleta** y volver a leerla, que los campos vacíos queden nulos y no en cero, que el muslo se guarde —un campo que el formulario del atleta no ofrece—, que **un entrenador ajeno reciba 403 tanto al leer como al escribir**, y que rutinas, planes y check-ins traigan `athlete_id` y los campos concretos que la ficha pinta. Las tres cuentas temporales se eliminaron y se comprobó que no quedara nada.
- Comprobación del contrato de la pantalla, 14 controles: identificadores, campos del formulario, ausencia de atributos `style`, escapado de textos, uso del módulo compartido en las dos pantallas, **que el mapa ya no esté duplicado**, que la lista enlace a la ficha y que las clases usadas tengan estilo.
- Las 24 pruebas automatizadas siguen pasando, `format:check` conforme y las páginas nuevas responden 200.

**Pendiente de esta fase.** Confirmación visual del usuario: entrar a Atletas, pulsar sobre un nombre y revisar la ficha completa, incluido registrar una medición desde ahí y comprobar que aparece en la gráfica y en el historial.

## Sesión del 14 de agosto de 2026: continuidad de la bitácora

El usuario pidió que `VISION_PRODUCTO.md` siga siendo la fuente de contexto del proyecto y que, desde esta sesión, se registre aquí **todo trabajo realizado, decisión tomada, verificación ejecutada, problema encontrado y pendiente nuevo**. La actualización debe hacerse durante cada bloque de trabajo y no dejarse únicamente para el cierre de la jornada.

### Punto exacto de reanudación

- El bloque vigente conserva este orden: ficha individual del atleta, duplicar rutinas, notificaciones y fotos de progreso.
- La **ficha individual del atleta está implementada**, pero todavía requiere la confirmación visual del usuario en el navegador.
- Después de esa ficha se empezó un ajuste adicional para que atleta y entrenador compartan correctamente una única medición por fecha: si uno registra peso y el otro cintura el mismo día, el segundo guardado debe completar la ficha sin borrar el primer dato. También se extrajo la presentación de las mediciones a `public/js/comun/mediciones.js` para que ambas vistas dibujen el mismo conjunto de métricas.
- Ese ajuste ya tiene la prueba nueva `test/measurements-sync.test.js`, pero todo este bloque sigue como **trabajo local sin commit** junto con la ficha y otros cambios de documentación e higiene.
- La siguiente fase funcional acordada, una vez revisado y cerrado este trabajo, es **duplicar rutinas**.

### Regla operativa confirmada para esta sesión

Antes de ejecutar migraciones, semillas, pruebas o comprobaciones que escriban datos se verificará el `hostname` de `DATABASE_URL`, sin mostrar credenciales. La configuración conocida apunta a Neon y las pruebas automatizadas crean y eliminan datos temporales allí, por lo que no se ejecutarán de manera rutinaria sin tener presente ese impacto.

### Fase 2 iniciada: duplicar rutinas

El usuario confirmó el inicio de la segunda fase y pidió mantener una documentación especialmente detallada. Antes de modificar el código se verificó que el árbol de trabajo estaba limpio y que el bloque anterior quedó guardado en Git con el commit `d3c8412` (`agregando medidas y cuenta de atleta para entrenador`).

#### Alcance y comportamiento acordados

La duplicación será **asistida**, no inmediata: desde la lista o el detalle de rutinas, `Duplicar` abrirá el constructor semanal con los datos de la rutina de origen ya cargados. El entrenador podrá revisar y cambiar nombre, atleta, descripción, fecha, duración, días y ejercicios antes de guardar. Solo al enviar el formulario se creará la rutina nueva.

La copia tendrá estas reglas:

- Se conservarán el atleta seleccionado, la descripción, la duración, los tipos de día, los días espejo, las notas y todos los parámetros de cada ejercicio.
- El nombre recibirá el sufijo ` (copia)` y respetará el máximo de 140 caracteres.
- La fecha inicial será la fecha actual, no la fecha de la rutina original, porque una copia es un plan nuevo y heredar una fecha antigua podría hacer que naciera avanzada o vencida.
- El atleta permanecerá seleccionado para acelerar el caso común, pero podrá cambiarse antes de guardar. El modelo actual admite varias rutinas activas para un mismo atleta y la pantalla del atleta ya muestra una lista de rutinas, no una única rutina exclusiva.
- La rutina original no se modificará ni archivará.
- La copia no heredará sesiones, ejercicios marcados, series realizadas ni cumplimiento.
- La copia tendrá un linaje nuevo: no se enviará por el flujo `PUT` de modificación, sino por el `POST /api/routines` de creación. Así `origin_routine_id` apuntará a la copia misma y el progreso futuro de ambas rutinas quedará separado.
- Los permisos existentes se reutilizarán: `GET /api/routines/:id` solo entrega la rutina si pertenece al entrenador autenticado, y la creación vuelve a comprobar que el atleta elegido conserve un vínculo activo.

#### Hallazgo durante la inspección

La API de detalle devuelve parámetros avanzados de cada ejercicio —`targetWeight`, `rir`, `tempo` y `notes`—, pero el constructor actual solo conserva `exerciseId`, series, repeticiones y descanso al cargar y volver a guardar. Por tanto, modificar una rutina creada con esos campos desde otra fuente podría borrarlos silenciosamente. La fase 2 corregirá también este defecto: aunque esos valores todavía no tengan controles visibles en el constructor, viajarán en el estado de cada fila y volverán a enviarse sin alteración. Esto es necesario para que «duplicar» signifique una copia fiel y también hace más segura la edición existente.

#### Estrategia de implementación y verificación

La conversión de una rutina recibida por la API a un borrador nuevo se aislará en un módulo puro, sin dependencias del navegador. Eso permitirá probar con `node:test`, sin servidor y **sin escribir en Neon**, que se conservan todos los campos, que la fecha y el nombre se ajustan, que se completan las siete franjas de la semana y que modificar el borrador no altera el objeto original. Después se comprobarán el contrato HTML/JavaScript, el formato y el diff. Las pruebas de integración que escriben en la base solo se ejecutarán si resultan imprescindibles y después de confirmar el destino de `DATABASE_URL`.

#### Fase 2 terminada: implementación

**Accesos a la acción.** Cada tarjeta de `Rutinas` tiene ahora un botón secundario `Duplicar` con el icono de copia. El mismo acceso aparece en la cabecera del detalle desplegado, junto a `Modificar rutina`. Ambos navegan a `rutina-formulario.html?duplicar=<id>`. Se mantuvo `Modificar` con `?id=<id>` como una operación distinta y, si una URL incluyera accidentalmente los dos parámetros, el modo de edición tiene prioridad para impedir que una pantalla intente modificar y duplicar a la vez.

**Tres modos en un solo constructor.** `rutina-formulario.js` distingue ahora entre crear desde cero, modificar y duplicar. En duplicación cambia el título de la pestaña y de la página a `Duplicar rutina`, explica que se revise la copia y cambia el botón final a `Crear copia`. También descubre un aviso que aclara antes de guardar que se está preparando una rutina nueva y que la original y su progreso no cambiarán. Si la rutina de origen no existe o no pertenece al usuario, el error de la API se muestra y el formulario se oculta, igual que ya ocurría al editar.

**Borrador independiente.** Se creó `public/js/comun/rutina-copia.js`, un módulo puro que transforma la respuesta de detalle en el estado que consume el constructor. El módulo:

- crea objetos nuevos para la semana, los días y los ejercicios, sin compartir referencias con la respuesta original;
- completa como días libres las franjas ausentes hasta llegar a siete;
- conserva atleta, descripción, duración, nombres, tipos de día, espejos y notas;
- conserva de cada ejercicio el catálogo, nombre, series, repeticiones, peso objetivo, descanso, RIR, tempo y notas;
- reemplaza la fecha original por la fecha local del día en que se prepara la copia;
- añade una sola vez el sufijo ` (copia)` y recorta únicamente la base del nombre cuando sea necesario para respetar el límite de 140 caracteres;
- omite deliberadamente identificadores de rutina, filas y linaje.

**Guardado y separación del progreso.** El parámetro `duplicar` nunca llena `routineId`, que es la única variable que decide entre `PUT` y `POST`. Por eso `Crear copia` usa `POST /api/routines`: el repositorio crea una fila nueva, le asigna su propio `origin_routine_id` y crea filas nuevas para días y ejercicios. Las sesiones y series realizadas no forman parte del cuerpo del formulario y no se copian. No fue necesario añadir endpoint, migración ni consulta SQL.

**Corrección preventiva en la edición existente.** Los campos avanzados descubiertos durante la inspección se guardan ahora como metadatos de la fila del ejercicio mientras esta vive en el DOM. `captureCurrentDay()` los incorpora de nuevo al estado y el cuerpo enviado conserva `targetWeight`, `rir`, `tempo` y `notes`; `restSeconds` también conserva correctamente `null` en vez de convertirlo en cero. Los controles visibles siguen siendo los mismos, pero modificar o duplicar ya no destruye información que todavía no se puede editar desde esta pantalla.

**Archivos modificados o creados.** Se modificaron `public/js/entrenador/rutinas.js`, `public/js/entrenador/rutina-formulario.js` y `public/entrenador/rutina-formulario.html`. Se crearon `public/js/comun/rutina-copia.js` y `test/routine-copy.test.js`. Este documento se actualizó antes, durante y al terminar la fase.

#### Verificaciones de la fase 2

- `test/routine-copy.test.js` contiene tres pruebas que pasan: copia fiel e independiente, reglas del nombre y contrato entre la lista, el constructor y el HTML.
- La prueba principal verifica expresamente atleta, descripción, fecha local nueva, seis semanas, siete franjas, descanso, día espejo y todos los parámetros avanzados del ejercicio. Después modifica el borrador y comprueba que el objeto de origen no cambió.
- La prueba del nombre comprueba tanto el máximo de 140 caracteres como que duplicar una copia no acumule ` (copia) (copia)`.
- La prueba de contrato comprueba que existan los dos enlaces `?duplicar=`, que el constructor lea ese parámetro, que cargue el módulo de transformación, que el guardado sea `POST` al no existir `routineId` y que el aviso exista inicialmente oculto en el HTML.
- `node --check` aprobó los tres módulos JavaScript implicados.
- Prettier revisó todo el JavaScript de `src`, `public/js`, `database` y `test` sin modificar archivos ajenos a esta fase; `git diff --check` quedó limpio.
- No se ejecutó la suite completa ni se crearon datos de prueba: las pruebas nuevas son unitarias y de contrato, y por tanto **no escribieron en Neon**. El comportamiento de creación independiente sobre PostgreSQL ya está cubierto por `weekly-routines.test.js`, cuya prueba existente afirma que una rutina nueva es su propio origen.

**Pendiente de revisión visual.** Como entrenador: abrir `Rutinas`, pulsar `Duplicar` desde una tarjeta y también desde un detalle, comprobar que aparece el aviso y que nombre, atleta, duración y semana están precargados; verificar que la fecha sea la actual; cambiar al menos el nombre o el atleta; guardar; y confirmar en la lista que aparecen tanto la original como la copia. No se debe registrar progreso de la copia para esta revisión.

La siguiente fase del bloque, después de esa confirmación visual, es **notificaciones**.

### Fase 3 iniciada: notificaciones dentro de la aplicación

El usuario autorizó implementar la fase completa. El trabajo local de duplicación de rutinas todavía no estaba confirmado en Git al comenzar, por lo que se preserva sin mezclar ni revertir ninguno de sus archivos.

#### Estado encontrado y alcance elegido

La tabla `notifications` existe desde `001_initial_schema.sql` y ya tiene propietario, tipo, título, cuerpo, enlace, fecha de lectura y fecha de creación, además de un índice parcial para las pendientes. Sin embargo, ningún módulo de `src` escribía o consultaba la tabla y no existían rutas, página ni acceso de navegación. No hace falta una migración.

Esta fase conectará cinco recorridos que ya existen y tienen destinatario inequívoco:

1. Rutina nueva o actualizada: aviso al atleta.
2. Día de entrenamiento completado, incluso por cierre automático al marcar el último ejercicio: aviso al entrenador.
3. Medición registrada por el entrenador: aviso al atleta. Una medición escrita por el propio atleta no genera un aviso para sí mismo.
4. Check-in enviado: aviso al entrenador; retroalimentación registrada: aviso al atleta.
5. Mensaje nuevo: aviso a la otra persona de la conversación.
6. Invitación aceptada: aviso al entrenador que la creó.

La bandeja será compartida por ambos roles y permitirá listar, abrir el destino, marcar una como leída y marcar todas como leídas. La navegación mostrará el total pendiente: directamente junto a `Notificaciones` en el menú lateral y, en móvil, sobre el acceso `Más`, porque la bandeja no reemplazará ninguno de los cuatro accesos principales de la barra inferior.

#### Reglas técnicas y de seguridad

- Todas las lecturas y actualizaciones filtrarán por el `user_id` de la sesión; enviar el identificador de una notificación ajena no permitirá verla ni marcarla.
- La ruta `read-all` se declarará antes de `/:id/read` para que Express no confunda una palabra fija con un identificador.
- Los enlaces generados serán rutas internas fijas. La interfaz solo navegará a valores que empiecen por `/`, aunque la tabla contenga un dato incorrecto.
- La finalización de entrenamientos llevará una marca `newlyCompleted`: solo la transición de pendiente a completado crea aviso. Volver a guardar un día ya cerrado no duplicará notificaciones.
- La creación seguirá en los servicios de cada dominio, después de sus comprobaciones de permisos. El repositorio de notificaciones solo contendrá SQL parametrizado.
- El contador no impedirá cargar la navegación si falla: en ese caso se mostrará el menú normalmente sin número, mientras que la bandeja sí enseñará el error correspondiente.

#### Fase 3 terminada: backend y API

Se creó el módulo completo de notificaciones siguiendo la separación habitual:

```text
routes/notifications.routes.js
        ↓
controllers/notifications.controller.js
        ↓
services/notifications.service.js
        ↓
repositories/notifications.repository.js
        ↓
PostgreSQL
```

El repositorio implementa creación, creación idempotente, listado de las cien más recientes, contador pendiente, lectura individual y lectura masiva. La creación idempotente usa usuario, tipo y enlace como clave estable; se reserva para eventos que pueden corregirse o repetirse sin representar una novedad distinta.

**Endpoints nuevos:**

- `GET /api/notifications`: últimas cien notificaciones del usuario de la sesión.
- `GET /api/notifications/unread-count`: cantidad pendiente para la navegación.
- `PUT /api/notifications/read-all`: marca todas las propias como leídas y devuelve cuántas cambió.
- `PUT /api/notifications/:id/read`: marca una propia; el parámetro se valida como UUID y una notificación ajena responde como no encontrada.

Las rutas se montaron en `src/app.js`. No se añadió ninguna migración porque Neon y el esquema local ya tienen la tabla y el índice necesarios desde la migración inicial.

#### Eventos conectados

**Rutinas.** `createRoutine` avisa al atleta cuando se crea una rutina activa asignada. `updateRoutine` avisa sobre la nueva versión. Una plantilla sin atleta o una rutina no activa no genera aviso. Duplicar una rutina pasa por la creación normal, por lo que su nuevo atleta recibe el mismo evento cuando se guarda la copia.

**Entrenamientos.** `refreshCompletion` devuelve ahora `newlyCompleted`, calculado comparando el estado anterior y posterior de la sesión. `finishWorkout` aplica la misma regla. El servicio consulta el entrenador, atleta, rutina, día y tipo de día solo cuando ocurre esa transición. Los descansos se pueden marcar como cumplidos pero **no generan** `Entrenamiento completado`. El aviso usa un enlace con el atleta y la sesión como clave estable; desmarcar y volver a completar la misma sesión no crea otro. Esto cubre tanto el cierre automático al marcar el último ejercicio como el cierre manual.

**Mediciones.** Solo una medición escrita por el entrenador avisa al atleta; el atleta no recibe un aviso de su propia acción. Como una ficha del mismo día puede actualizarse varias veces, se utiliza creación idempotente con el identificador estable de la medición.

**Check-ins.** Enviar el formulario avisa al entrenador con el nombre del atleta. Registrar o corregir la retroalimentación avisa una sola vez al atleta por identificador de check-in.

**Invitaciones.** Al aceptar una invitación se avisa al entrenador que la creó y se enlaza a su lista de atletas.

**Mensajes.** Después de validar la pertenencia a la conversación y guardar el mensaje, se consulta quién es la otra persona y se crea su aviso. El enlace incluye la conversación. `public/js/compartido/mensajes.js` lee ese parámetro después de cargar la lista y abre el hilo; el servidor vuelve a comprobar el permiso, por lo que alterar la URL no concede acceso.

#### Bandeja e indicador visual

Se crearon `public/compartido/notificaciones.html` y `public/js/compartido/notificaciones.js`. La bandeja distingue visualmente pendientes y leídas, muestra fecha relativa, permite marcar una, abrir su destino o marcar todas. Los títulos y textos pasan por escapado HTML. Antes de navegar, el enlace se acepta únicamente si empieza por `/`; un valor externo o mal formado almacenado en la tabla no se abre.

Se añadió el icono propio `notificaciones` al catálogo SVG. Ambos menús de rol incluyen la bandeja. `initNavigation()` pide el contador una vez al construir la interfaz; en escritorio lo muestra junto al enlace exacto y en móvil sobre `Más`. La bandeja actualiza o elimina ambos indicadores al leer elementos, sin recargar la página. Si falla únicamente la petición del contador, la navegación sigue construyéndose.

Los estilos nuevos cubren tarjeta, estado pendiente, icono, cabecera, contador y adaptación por debajo de 520 px. La barra inferior usa posición relativa para anclar el contador sin mover el icono ni el texto.

#### Pruebas, fallo encontrado y corrección

Se añadieron `test/notifications.test.js` y `test/notification-contract.test.js`, y se amplió `test/weekly-routines.test.js`.

La prueba de base crea exactamente dos usuarios temporales y comprueba:

- listado y contador aislados por propietario;
- imposibilidad de marcar una notificación ajena;
- lectura individual y masiva sin alterar al otro usuario;
- creación idempotente para una misma clave de evento;
- borrado final de los dos usuarios, con las notificaciones eliminadas por cascada.

La prueba de contrato comprueba el montaje de la API, el orden de rutas, los identificadores de la página, el filtro de enlaces internos, el contador de navegación y la presencia de los ocho tipos conectados: `routine_assigned`, `routine_updated`, `workout_completed`, `measurement_added`, `checkin_submitted`, `checkin_reviewed`, `invitation_accepted` y `message_received`.

La prueba semanal comprueba ahora en PostgreSQL que asignar una rutina avisa al atleta, completar el último ejercicio avisa al entrenador, volver a guardar no duplica el aviso y completar un descanso no suma otro.

**Fallo encontrado durante la verificación.** La primera versión de `createOnce` reutilizaba los mismos parámetros en un `INSERT ... SELECT` y en `NOT EXISTS`. PostgreSQL dedujo `text` en una posición y `varchar` en otra, devolviendo `42P08: inconsistent types deduced for parameter`. Eso hizo fallar la prueba nueva y, como consecuencia, las comprobaciones semanales que esperaban el aviso. Se corrigió declarando de forma explícita `uuid`, `varchar(50)`, `varchar(160)` y `text` en el `SELECT`. Al repetir únicamente las dos pruebas afectadas pasaron 24/24, incluido deshacer y volver a completar.

#### Verificación final de la fase 3

- Antes de escribir datos se confirmó exclusivamente el hostname: `ep-falling-heart-ay0in6eg-pooler.c-5.us-east-2.aws.neon.tech`.
- La suite completa terminó con **40 pruebas aprobadas, cero fallos**.
- `npm.cmd run format:check` confirmó todo el JavaScript.
- `git diff --check` no encontró espacios o marcadores incorrectos.
- Una consulta final buscó los prefijos temporales de contraseña, medición, rutina y notificación: `usuarios_temporales_restantes=0`.
- Persiste la advertencia ya conocida de `pg` sobre hacer explícito `sslmode=verify-full` antes de la próxima versión mayor; no fue causada por esta fase.

**Archivos de esta fase:** nuevos `src/repositories/notifications.repository.js`, `src/services/notifications.service.js`, `src/controllers/notifications.controller.js`, `src/routes/notifications.routes.js`, `public/compartido/notificaciones.html`, `public/js/compartido/notificaciones.js`, `test/notifications.test.js` y `test/notification-contract.test.js`; modificados `src/app.js`, los servicios de rutinas, seguimiento, vínculos y mensajes, los repositorios de rutinas y mensajes, `public/js/comun/navigation.js`, `public/js/comun/icons.js`, `public/js/compartido/mensajes.js`, `public/css/layout.css`, `public/css/components.css` y `test/weekly-routines.test.js`.

**Pendiente de revisión visual.** Probar con las dos cuentas reales: provocar un evento —el mensaje es el más rápido—, confirmar el contador en escritorio y móvil, abrir la bandeja, entrar al destino, marcar una y luego todas, y revisar temas claro/oscuro. El contador se actualiza al cargar una página y al leer desde la bandeja; no se transmite en vivo mientras se permanece en otra pantalla. Las notificaciones en tiempo real pueden añadirse después si se considera necesario.

La siguiente y última fase del bloque acordado es **fotografías de progreso**, que requiere decidir el proveedor de almacenamiento privado antes de escribir la carga de archivos.
