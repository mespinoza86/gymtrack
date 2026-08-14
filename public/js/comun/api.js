export async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'No se pudo completar la solicitud');
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
