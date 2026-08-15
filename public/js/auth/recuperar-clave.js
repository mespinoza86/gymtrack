import { api, formData, showMessage } from '../comun/api.js';
import { themeButton } from '../comun/theme.js';

document
  .querySelector('.auth-panel')
  .append(Object.assign(themeButton(), { className: 'icon-btn auth-theme' }));

const form = document.querySelector('#forgot');
const message = document.querySelector('#message');

form.onsubmit = async (event) => {
  event.preventDefault();
  const button = form.querySelector('button[type=submit]');
  button.disabled = true;

  try {
    const { message: text } = await api('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(formData(form)),
    });
    /* El servidor responde lo mismo exista o no la cuenta, así que aquí
       tampoco se puede decir nada más concreto. Se oculta el formulario para
       que quede claro que ya no hay que hacer nada más. */
    showMessage(message, `${text} Revisa también la carpeta de correo no deseado.`, 'success');
    form.hidden = true;
  } catch (error) {
    showMessage(message, error.message, 'error');
    button.disabled = false;
  }
};
