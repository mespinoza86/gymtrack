/* Rutinas del atleta.

   La pantalla tiene tres estados sucesivos sobre el mismo contenedor:
   la lista de rutinas asignadas, el detalle de un día con sus ejercicios,
   y el formulario de registro mientras se entrena.

   Además incluye la ayuda por ejercicio: las instrucciones se despliegan
   en la misma tarjeta y el video se abre en una ventana modal, para que el
   atleta nunca pierda lo que ya escribió en el formulario. */

import { initNavigation } from '../comun/navigation.js';
import { api, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

await initNavigation();

const list = document.querySelector('#routines');
const detail = document.querySelector('#detail');
const message = document.querySelector('#message');
const modal = document.querySelector('#video-modal');
const videoContent = document.querySelector('#video-content');

/* ---------- Video de demostración ---------- */

/* Convierte el enlace que escribió el entrenador en una dirección que se
   pueda incrustar. Solo se aceptan YouTube y Vimeo, que son los únicos
   proveedores autorizados por la política de seguridad del servidor.
   Cualquier otro enlace devuelve null y se ofrecerá abrirlo aparte. */
function videoEmbedUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);

    const esYouTube = ['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname);
    if (esYouTube && url.pathname === '/watch') {
      const id = url.searchParams.get('v');
      if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
    }

    /* Enlace abreviado: el identificador va en la ruta. */
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
    }

    if (url.hostname === 'vimeo.com' || url.hostname === 'www.vimeo.com') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if (/^\d+$/.test(id || '')) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {
    /* Un enlace mal formado se trata igual que un proveedor no admitido. */
  }

  return null;
}

function openVideo(url, title) {
  const embedUrl = videoEmbedUrl(url);
  document.querySelector('#video-title').textContent = title;

  videoContent.innerHTML = embedUrl
    ? `
      <div class="video-frame">
        <iframe
          src="${embedUrl}"
          title="Video de ${escapeHtml(title)}"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>`
    : `
      <div class="notice">
        <p>Este proveedor no permite reproducir el video dentro de GymTrack.</p>
        <a class="btn" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
          Abrir video en otra pestaña
        </a>
      </div>`;

  modal.showModal();
}

/* Vaciar el contenido antes de cerrar destruye el reproductor y detiene el
   video; si solo se cerrara la ventana, el audio seguiría sonando. */
function closeVideo() {
  videoContent.replaceChildren();
  modal.close();
}

document.querySelector('#close-video').onclick = closeVideo;

/* Cerrar al pulsar el fondo oscurecido, fuera del recuadro. */
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeVideo();
});

/* Cerrar con la tecla Escape, pasando por la misma limpieza. */
modal.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeVideo();
});

/* ---------- Ayuda por ejercicio ---------- */

function helpButtons(exercise) {
  const instructions = exercise.instructions
    ? `
        <details class="exercise-help">
          <summary>Ver instrucciones</summary>
          <p>${escapeHtml(exercise.instructions)}</p>
        </details>`
    : '';

  const video = exercise.mediaUrl
    ? `
        <button
          type="button"
          class="btn secondary small exercise-video"
          data-url="${escapeHtml(exercise.mediaUrl)}"
          data-title="${escapeHtml(exercise.name)}"
        >Ver video</button>`
    : '';

  if (!instructions && !video) {
    return '<small class="muted">Este ejercicio no tiene instrucciones ni video.</small>';
  }

  return `<div class="exercise-support">${instructions}${video}</div>`;
}

/* Se vuelve a llamar después de cada dibujado, porque al reemplazar el
   HTML los botones anteriores desaparecen con sus manejadores. */
function bindHelpButtons() {
  document.querySelectorAll('.exercise-video').forEach((button) => {
    button.onclick = () => openVideo(button.dataset.url, button.dataset.title);
  });
}

/* ---------- Registro del entrenamiento ---------- */

/* Una fila por serie planificada. Los datos escritos se leen después
   desde el DOM usando estos atributos `data-`. */
function renderSetRow(exercise, index) {
  const numero = index + 1;

  return `
            <div class="list-item set" data-exercise="${exercise.id}" data-number="${numero}">
              <strong>Serie ${numero}</strong>
              <div class="form-row">
                <div class="field">
                  <label>Repeticiones</label>
                  <input data-field="reps" type="number" min="0" required>
                </div>
                <div class="field">
                  <label>Peso (kg)</label>
                  <input data-field="weight" type="number" min="0" step=".25" required>
                </div>
              </div>
              <label><input data-field="pain" type="checkbox"> Sentí dolor o molestia</label>
            </div>`;
}

function renderWorkoutExercise(exercise) {
  const descanso = exercise.restSeconds ?? '—';
  const series = Array.from({ length: exercise.sets }, (_, index) => renderSetRow(exercise, index));

  return `
      <section class="workout-exercise">
        <h3>${escapeHtml(exercise.name)}</h3>
        <p>
          ${exercise.sets} series · objetivo ${escapeHtml(exercise.reps)} repeticiones ·
          descanso ${descanso} s
        </p>
        ${helpButtons(exercise)}
        <div class="list">${series.join('')}</div>
      </section>`;
}

function renderWorkoutForm(day) {
  return `
    <form class="card" id="workout">
      <h2>${escapeHtml(day.name)}</h2>
      ${day.exercises.map(renderWorkoutExercise).join('')}
      <div class="field">
        <label>Energía (1–10)</label>
        <input name="energy" type="number" min="1" max="10">
      </div>
      <div class="field">
        <label>Notas</label>
        <textarea name="notes"></textarea>
      </div>
      <button class="btn">Finalizar entrenamiento</button>
    </form>`;
}

/* Recorre las filas dibujadas y arma el cuerpo que espera el servidor. */
function collectSets() {
  return [...document.querySelectorAll('.set')].map((row) => ({
    routineExerciseId: row.dataset.exercise,
    setNumber: Number(row.dataset.number),
    reps: Number(row.querySelector('[data-field=reps]').value),
    weight: Number(row.querySelector('[data-field=weight]').value),
    pain: row.querySelector('[data-field=pain]').checked,
  }));
}

async function startDay(dayId, routine) {
  /* La sesión se abre en el servidor antes de mostrar el formulario, para
     que el registro quede asociado a un entrenamiento existente. */
  const { session } = await api('/api/routines/workouts/start', {
    method: 'POST',
    body: JSON.stringify({ routineDayId: dayId }),
  });

  const day = routine.days.find((item) => item.id === dayId);

  detail.innerHTML = renderWorkoutForm(day);
  bindHelpButtons();

  document.querySelector('#workout').onsubmit = async (event) => {
    event.preventDefault();

    const body = {
      /* La energía es opcional: sin valor se envía nulo, no cero. */
      energy: event.target.energy.value ? Number(event.target.energy.value) : null,
      notes: event.target.notes.value,
      sets: collectSets(),
    };

    try {
      await api(`/api/routines/workouts/${session.id}/finish`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      location.href = '/atleta/historial.html';
    } catch (error) {
      showMessage(message, error.message, 'error');
    }
  };
}

/* ---------- Detalle de la rutina ---------- */

function renderDayExercise(exercise) {
  const descanso = exercise.restSeconds ?? '—';

  return `
      <div class="list-item">
        <strong>${escapeHtml(exercise.name)}</strong>
        <p>
          ${exercise.sets} series · ${escapeHtml(exercise.reps)} repeticiones ·
          descanso ${descanso} s
        </p>
        ${helpButtons(exercise)}
      </div>`;
}

function renderDay(day) {
  return `
    <article class="card">
      <h2>${escapeHtml(day.name)}</h2>
      ${day.exercises.map(renderDayExercise).join('')}
      <button class="btn start" data-day="${day.id}">Comenzar y registrar</button>
    </article>`;
}

async function openRoutine(id) {
  const { routine } = await api(`/api/routines/${id}`);

  detail.innerHTML = routine.days.map(renderDay).join('');
  bindHelpButtons();

  document.querySelectorAll('.start').forEach((button) => {
    button.onclick = () => startDay(button.dataset.day, routine);
  });
}

/* ---------- Lista de rutinas asignadas ---------- */

function renderRoutineCard(routine) {
  return `
    <article class="card">
      <span class="badge">Activa</span>
      <h2>${escapeHtml(routine.name)}</h2>
      <p>${escapeHtml(routine.description || '')}</p>
      <button class="btn" data-routine="${routine.id}">Abrir</button>
    </article>`;
}

const { routines } = await api('/api/routines');

list.innerHTML = routines.length
  ? routines.map(renderRoutineCard).join('')
  : '<div class="empty">Tu entrenador todavía no asignó una rutina.</div>';

document.querySelectorAll('[data-routine]').forEach((button) => {
  button.onclick = () => openRoutine(button.dataset.routine);
});
