import { api, formData, showMessage } from '../comun/api.js';
import { homeFor } from '../comun/auth.js';
import { initializePasswordToggles } from '../comun/password-toggle.js';
import { themeButton } from '../comun/theme.js';

initializePasswordToggles();
document.querySelector('.auth-panel').append(Object.assign(themeButton(), { className: 'icon-btn auth-theme' }));

document.querySelector('#register').onsubmit = async (event) => {
  event.preventDefault();
  const message = document.querySelector('#message');
  const data = formData(event.target);

  /* La confirmación se comprueba aquí y nunca se envía al servidor. */
  if (data.password !== data.confirmPassword) {
    showMessage(message, 'Las contraseñas no coinciden.', 'error');
    event.target.elements.confirmPassword.focus();
    return;
  }
  delete data.confirmPassword;

  try {
    const { user } = await api('/api/auth/register', { method: 'POST', body: JSON.stringify(data) });
    location.href = homeFor(user.role);
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};
