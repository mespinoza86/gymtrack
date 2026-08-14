# Visión del producto: plataforma para entrenadores y atletas

> Documento vivo para conservar el contexto, las ideas y las decisiones del proyecto.
> Última actualización: 11 de agosto de 2026.

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
