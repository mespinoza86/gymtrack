/* Pantalla "Mi perfil". Reúne tres formularios independientes:
   los datos personales, el cambio de contraseña y, solo para atletas,
   la vinculación con un entrenador mediante un código de invitación. */

import { initNavigation } from '../comun/navigation.js';
import { api, formData, showMessage } from '../comun/api.js';
import { initializePasswordToggles } from '../comun/password-toggle.js';
import { escapeHtml } from '../comun/dom.js';

const user = await initNavigation();

/* Agrega el ojo de mostrar/ocultar a los tres campos de contraseña. */
initializePasswordToggles();

const message = document.querySelector('#message');
const form = document.querySelector('#profile');

/* Los datos personales llegan ya cargados desde la navegación, así que
   el formulario se rellena sin pedir nada más al servidor. */
form.firstName.value = user.first_name;
form.lastName.value = user.last_name;
form.email.value = user.email;
form.phone.value = user.phone || '';
form.birthDate.value = user.birth_date?.slice(0, 10) || '';

/* El código de invitación lo canjea el atleta, no el entrenador. */
if (user.role === 'trainer') {
  document.querySelector('#invite-box').classList.add('hidden');
}

/* ---------- Vinculaciones activas ---------- */

function renderPerson(person) {
  return `
    <div class="list-item">
      <strong>${escapeHtml(person.first_name)} ${escapeHtml(person.last_name)}</strong>
      <br>
      <small>${escapeHtml(person.email)}</small>
    </div>`;
}

async function loadPeople() {
  const { people } = await api('/api/links/people');

  document.querySelector('#people').innerHTML = people.length
    ? people.map(renderPerson).join('')
    : '<div class="empty">No hay vinculaciones activas.</div>';
}

/* ---------- Datos personales ---------- */

form.onsubmit = async (event) => {
  event.preventDefault();

  const data = formData(event.target);

  /* El correo se muestra pero no se puede cambiar desde aquí. */
  delete data.email;

  try {
    await api('/api/auth/profile', { method: 'PUT', body: JSON.stringify(data) });
    showMessage(message, 'Perfil actualizado');
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};

/* ---------- Cambio de contraseña ---------- */

document.querySelector('#change-password').onsubmit = async (event) => {
  event.preventDefault();

  const data = formData(event.target);

  /* Estas dos comprobaciones se repiten después en el servidor. Aquí solo
     evitan un viaje innecesario y dan un aviso inmediato. */
  if (data.newPassword !== data.confirmPassword) {
    showMessage(message, 'Las contraseñas nuevas no coinciden.', 'error');
    event.target.elements.confirmPassword.focus();
    return;
  }

  if (data.currentPassword === data.newPassword) {
    showMessage(message, 'La nueva contraseña debe ser diferente de la actual.', 'error');
    event.target.elements.newPassword.focus();
    return;
  }

  /* La confirmación no viaja al servidor: solo sirve en el navegador. */
  delete data.confirmPassword;

  try {
    await api('/api/auth/password', { method: 'PUT', body: JSON.stringify(data) });
    event.target.reset();
    showMessage(message, 'Contraseña actualizada correctamente.');
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};

/* ---------- Canje del código de invitación ---------- */

document.querySelector('#accept').onsubmit = async (event) => {
  event.preventDefault();

  try {
    await api('/api/links/accept', {
      method: 'POST',
      body: JSON.stringify(formData(event.target)),
    });
    event.target.reset();
    showMessage(message, 'Entrenador vinculado correctamente');

    /* La lista se vuelve a pedir para que aparezca el vínculo recién creado. */
    loadPeople();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};

loadPeople();
