/* Aplica el tema guardado antes de que la página se pinte, para evitar
   que aparezca un destello del tema contrario al abrir cada pantalla.

   El oscuro es el tema base declarado en el CSS, así que aquí solo hace
   falta marcar el documento cuando la persona eligió claro a mano. Si no
   hay nada guardado, la aplicación arranca en oscuro.

   Se carga como script clásico en <head>, no como módulo, porque los
   módulos se ejecutan después del pintado. Por eso no usa import ni
   export. La política de seguridad del servidor no permite scripts
   escritos directamente dentro del HTML, así que vive en su propio
   archivo. */
(function () {
  try {
    if (localStorage.getItem('gymtrack-theme') === 'light') {
      document.documentElement.dataset.theme = 'light';
    }
  } catch (error) {
    /* Si el navegador bloquea el almacenamiento local se conserva
       el tema oscuro base, que ya es el comportamiento deseado. */
  }
})();
