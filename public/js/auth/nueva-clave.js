import { api, formData, showMessage } from '../comun/api.js';
import { initializePasswordToggles } from '../comun/password-toggle.js';
import { themeButton } from '../comun/theme.js';

initializePasswordToggles();
document
  .querySelector('.auth-panel')
  .append(Object.assign(themeButton(), { className: 'icon-btn auth-theme' }));

const form = document.querySelector('#reset');
const message = document.querySelector('#message');
const token = new URLSearchParams(location.search).get('token') ?? '';

/* Sin token no hay nada que hacer aquí: pasa cuando alguien abre la dirección
   a mano o cuando el cliente de correo recorta el enlace. */
if (!token) {
  showMessage(
    message,
    'Este enlace está incompleto. Vuelve a solicitar el correo de recuperación.',
    'error',
  );
  form.hidden = true;
}

form.onsubmit = async (event) => {
  event.preventDefault();
  const data = formData(form);

  /* La confirmación se comprueba aquí y nunca viaja al servidor, igual que en
     el registro y en el cambio de contraseña del perfil. */
  if (data.password !== data.confirmPassword) {
    showMessage(message, 'Las contraseñas no coinciden.', 'error');
    form.elements.confirmPassword.focus();
    return;
  }

  const button = form.querySelector('button[type=submit]');
  button.disabled = true;

  try {
    await api('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password: data.password }),
    });
    showMessage(
      message,
      'Contraseña actualizada. Ya puedes iniciar sesión con la nueva.',
      'success',
    );
    form.hidden = true;
  } catch (error) {
    showMessage(message, error.message, 'error');
    button.disabled = false;
  }
};
