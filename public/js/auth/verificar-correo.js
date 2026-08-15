import { api, formData, showMessage } from '../comun/api.js';
import { themeButton } from '../comun/theme.js';

document
  .querySelector('.auth-panel')
  .append(Object.assign(themeButton(), { className: 'icon-btn auth-theme' }));

const message = document.querySelector('#message');
const resend = document.querySelector('#resend');
const params = new URLSearchParams(location.search);
const token = params.get('token') ?? '';

/* Cuando se llega desde el login, el correo ya se conoce: se rellena para no
   obligar a escribirlo otra vez. */
const known = params.get('email');
if (known) resend.elements.email.value = known;

/* La confirmación se intenta sola al abrir el enlace del correo: pedirle al
   usuario que además pulse un botón no aportaría nada. */
if (token) {
  showMessage(message, 'Confirmando tu correo…', 'notice');
  try {
    await api('/api/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) });
    showMessage(message, 'Correo confirmado. Ya puedes iniciar sesión.', 'success');
  } catch (error) {
    /* Un enlace vencido o ya usado es el caso habitual, y la salida es
       reenviarlo: por eso el formulario aparece justo aquí. */
    showMessage(message, error.message, 'error');
    resend.hidden = false;
  }
} else {
  showMessage(message, 'Escribe tu correo para recibir un enlace de confirmación.', 'notice');
  resend.hidden = false;
}

resend.onsubmit = async (event) => {
  event.preventDefault();
  const button = resend.querySelector('button[type=submit]');
  button.disabled = true;

  try {
    const { message: text } = await api('/api/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify(formData(resend)),
    });
    showMessage(message, `${text} Revisa también la carpeta de correo no deseado.`, 'success');
    resend.hidden = true;
  } catch (error) {
    showMessage(message, error.message, 'error');
    button.disabled = false;
  }
};
