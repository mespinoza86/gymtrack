/* El servidor entrega el token contra falsificación en una cookie legible.
   Se lee en cada llamada y no una sola vez al cargar, porque al iniciar
   sesión cambia y una copia guardada quedaría obsoleta. */
function csrfToken() {
  const found = document.cookie.match(/(?:^|;\s*)gymtrack\.csrf=([^;]*)/);
  return found ? decodeURIComponent(found[1]) : '';
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export async function api(path, options = {}) {
  const method = (options.method ?? 'GET').toUpperCase();

  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      /* Solo lo necesitan las peticiones que cambian algo. */
      ...(SAFE_METHODS.has(method) ? {} : { 'X-CSRF-Token': csrfToken() }),
      ...(options.headers || {}),
    },
    ...options,
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'No se pudo completar la solicitud');
    /* Algunos errores previstos traen un código para que la pantalla pueda
       reaccionar y no solo mostrar el texto, como el correo sin confirmar. */
    error.code = data.code;
    error.status = response.status;
    throw error;
  }
  return data;
}
export function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}
export function showMessage(element, message, type = 'notice') {
  element.className = type;
  element.textContent = message;
  element.hidden = false;
}
