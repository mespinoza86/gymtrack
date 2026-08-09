# Visión del producto: plataforma para entrenadores y atletas

> Documento vivo para conservar el contexto, las ideas y las decisiones del proyecto.
> Última actualización: 7 de agosto de 2026.

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
