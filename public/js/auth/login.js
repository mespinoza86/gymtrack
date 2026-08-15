import { api, formData, showMessage } from '../comun/api.js';
import { homeFor, currentUser } from '../comun/auth.js';
import { initializePasswordToggles } from '../comun/password-toggle.js';
import { themeButton } from '../comun/theme.js';

initializePasswordToggles();
document
  .querySelector('.auth-panel')
  .append(Object.assign(themeButton(), { className: 'icon-btn auth-theme' }));

/* Quien ya tiene sesión abierta no necesita volver a identificarse. */
const existing = await currentUser(false);
if (existing) location.href = homeFor(existing.role);

document.querySelector('#login').onsubmit = async (event) => {
  event.preventDefault();
  const message = document.querySelector('#message');
  const data = formData(event.target);
  try {
    const { user } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    location.href = homeFor(user.role);
  } catch (error) {
    showMessage(message, error.message, 'error');

    /* Una cuenta sin confirmar no es un error que el usuario pueda resolver
       reintentando: hay que darle la salida en el mismo sitio, con el correo
       ya escrito para que no tenga que teclearlo otra vez. */
    if (error.code === 'email_not_verified') {
      const link = document.createElement('a');
      link.href = `/verificar-correo.html?email=${encodeURIComponent(data.email ?? '')}`;
      link.textContent = 'Reenviar el correo de confirmación';
      message.append(document.createElement('br'), link);
    }
  }
};
