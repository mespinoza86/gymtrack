import { api, formData, showMessage } from '../comun/api.js';
import { initializePasswordToggles } from '../comun/password-toggle.js';
import { themeButton } from '../comun/theme.js';

initializePasswordToggles();
document
  .querySelector('.auth-panel')
  .append(Object.assign(themeButton(), { className: 'icon-btn auth-theme' }));

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
    const { emailSent } = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    /* Ya no se entra directamente: la cuenta queda pendiente de confirmar el
       correo. Si el envío falló, se dice y se ofrece el reenvío, porque de lo
       contrario la persona esperaría un mensaje que nunca va a llegar. */
    showMessage(
      message,
      emailSent
        ? 'Cuenta creada. Te enviamos un correo para confirmarla; revisa también la carpeta de correo no deseado.'
        : 'Cuenta creada, pero no pudimos enviar el correo de confirmación. Solicita el reenvío para poder entrar.',
      emailSent ? 'success' : 'error',
    );
    event.target.hidden = true;

    const link = document.createElement('a');
    link.href = `/verificar-correo.html?email=${encodeURIComponent(data.email ?? '')}`;
    link.textContent = 'Confirmar o reenviar el correo';
    message.append(document.createElement('br'), link);
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};
