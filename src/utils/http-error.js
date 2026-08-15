export class HttpError extends Error {
  /* `code` es opcional y viaja hasta el navegador. Sirve para los casos en que
     la pantalla necesita reaccionar de forma distinta y no solo mostrar el
     texto, como distinguir una contraseña incorrecta de una cuenta sin
     confirmar. */
  constructor(status, message, details, code) {
    super(message);
    this.status = status;
    this.details = details;
    this.code = code;
  }
}
