/* Aplica el tema guardado antes de que la página se pinte, para evitar
   que aparezca un destello del tema contrario al abrir cada pantalla.

   Se carga como script clásico en <head>, no como módulo, porque los
   módulos se ejecutan después del pintado. Por eso no usa import ni
   export. La política de seguridad del servidor no permite scripts
   escritos directamente dentro del HTML, así que vive en su propio
   archivo. */
(function () {
  try {
    var saved = localStorage.getItem('gymtrack-theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.dataset.theme = saved;
    }
  } catch (error) {
    /* Si el navegador bloquea el almacenamiento local se conserva
       la preferencia del sistema, que ya cubre el caso normal. */
  }
})();
