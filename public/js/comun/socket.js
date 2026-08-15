/* Conexión única de Socket.IO para toda la página.

   La usan dos cosas a la vez: el chat, que escucha los mensajes de la
   conversación abierta, y el menú, que escucha los avisos nuevos para subir el
   contador. Sin este módulo cada uno abriría su propia conexión.

   El cliente se carga bajo demanda en lugar de con una etiqueta `<script>` en
   cada una de las páginas. Así no hubo que tocar el HTML y, si la carga
   fallara, la aplicación sigue funcionando sin tiempo real: los avisos ya
   están guardados y aparecen igual al cambiar de pantalla. */

let conexion = null;
let cargando = null;

function cargarCliente() {
  if (window.io) return Promise.resolve(window.io);

  /* Se recuerda la promesa para que dos llamadas simultáneas no inserten la
     etiqueta dos veces. */
  cargando ??= new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = '/socket.io/socket.io.js';
    /* Tanto si carga como si no, se continúa: la falta de tiempo real no debe
       impedir que se dibuje el menú. */
    script.onload = () => resolve(window.io ?? null);
    script.onerror = () => resolve(null);
    document.head.append(script);
  });

  return cargando;
}

export async function socket() {
  if (conexion) return conexion;
  const io = await cargarCliente();
  if (!io) return null;
  conexion = io();
  return conexion;
}
