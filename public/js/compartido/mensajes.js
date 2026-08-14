import { initNavigation } from '../comun/navigation.js';
import { api, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

const user = await initNavigation();
const socket = window.io();

const list = document.querySelector('#conversations');
const chat = document.querySelector('#chat');
const message = document.querySelector('#message');
let active = null;

async function loadConversations() {
  const { conversations } = await api('/api/messages');
  list.innerHTML = conversations.length
    ? conversations
        .map(
          (conversation) => `<button class="list-item" data-id="${conversation.id}">
        <strong>${escapeHtml(conversation.other_first_name)} ${escapeHtml(conversation.other_last_name)}</strong>
        <small>${escapeHtml(conversation.last_message || 'Inicia la conversación')}</small>
      </button>`,
        )
        .join('')
    : '<div class="empty">Sin conversaciones.</div>';

  /* Se limita la búsqueda a la lista para no capturar otros
     elementos de la página que también usen data-id. */
  list.querySelectorAll('[data-id]').forEach((button) => {
    button.onclick = () => openConversation(button.dataset.id);
  });
}

function markActive(id) {
  list.querySelectorAll('[data-id]').forEach((button) => {
    button.classList.toggle('active', button.dataset.id === id);
  });
}

async function openConversation(id) {
  active = id;
  markActive(id);
  socket.emit('conversation:join', id);
  await refresh();
}

async function refresh() {
  if (!active) return;
  const { messages } = await api(`/api/messages/${active}`);
  render(messages);
}

function render(messages) {
  chat.innerHTML = messages.length
    ? messages
        .map(
          (item) => `<div class="bubble ${item.sender_id === user.id ? 'mine' : ''}">
        ${escapeHtml(item.body)}
        <small>${escapeHtml(item.first_name || '')} · ${new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
      </div>`,
        )
        .join('')
    : '<div class="empty">Todavía no hay mensajes. Escribe el primero.</div>';
  chat.scrollTop = chat.scrollHeight;
}

document.querySelector('#send').onsubmit = async (event) => {
  event.preventDefault();
  if (!active) return showMessage(message, 'Selecciona una conversación primero.', 'error');
  try {
    await api(`/api/messages/${active}`, {
      method: 'POST',
      body: JSON.stringify({ body: event.target.body.value }),
    });
    event.target.reset();
    await refresh();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};

socket.on('message:new', refresh);

await loadConversations();

/* Los avisos de mensaje enlazan a la conversación concreta. Solo se intenta
   abrirla después de cargar la lista; el servidor vuelve a validar acceso. */
const requestedConversation = new URLSearchParams(location.search).get('conversation');
if (requestedConversation) await openConversation(requestedConversation);
