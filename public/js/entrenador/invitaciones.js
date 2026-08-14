/* Invitaciones del entrenador: genera códigos de un solo uso para que
   un atleta se vincule, y lista los códigos ya emitidos con su estado. */

import { initNavigation } from '../comun/navigation.js';
import { api, showMessage } from '../comun/api.js';

await initNavigation();

const message = document.querySelector('#message');

/* El código y el estado los genera el servidor (un identificador aleatorio
   y un valor de una lista cerrada), por eso no necesitan escaparse. */
function renderInvitation(invitation) {
  return `
    <tr>
      <td><strong>${invitation.code}</strong></td>
      <td><span class="badge">${invitation.status}</span></td>
      <td>${new Date(invitation.expires_at).toLocaleString()}</td>
      <td>${new Date(invitation.created_at).toLocaleString()}</td>
    </tr>`;
}

async function load() {
  const { invitations } = await api('/api/links/invitations');

  document.querySelector('#invitations').innerHTML = invitations.length
    ? invitations.map(renderInvitation).join('')
    : '<tr><td colspan="4">No has creado invitaciones.</td></tr>';
}

document.querySelector('#create').onclick = async () => {
  try {
    const { invitation } = await api('/api/links/invitations', { method: 'POST' });
    showMessage(message, `Código creado: ${invitation.code}`);

    /* Se copia al portapapeles para poder pegarlo enseguida. No todos los
       navegadores lo permiten, así que la llamada es opcional. */
    await navigator.clipboard?.writeText(invitation.code);

    load();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};

await load();
