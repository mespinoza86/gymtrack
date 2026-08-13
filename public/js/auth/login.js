import { api, formData, showMessage } from '../comun/api.js';
import { homeFor, currentUser } from '../comun/auth.js';
import { initializePasswordToggles } from '../comun/password-toggle.js';
import { themeButton } from '../comun/theme.js';

initializePasswordToggles();
document.querySelector('.auth-panel').append(Object.assign(themeButton(), { className: 'icon-btn auth-theme' }));

/* Quien ya tiene sesión abierta no necesita volver a identificarse. */
const existing = await currentUser(false);
if (existing) location.href = homeFor(existing.role);

document.querySelector('#login').onsubmit = async (event) => {
  event.preventDefault();
  const message = document.querySelector('#message');
  try {
    const { user } = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(formData(event.target)) });
    location.href = homeFor(user.role);
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};
