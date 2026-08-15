export async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
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
