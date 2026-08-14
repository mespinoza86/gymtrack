/* Rutinas del atleta.

   La pantalla muestra la semana del plan como una fila de siete anillos de
   progreso. Al elegir un día se listan sus ejercicios y el atleta va marcando
   cada uno según lo termina: cada marca se guarda en el momento, así que puede
   cerrar la aplicación a mitad de entrenamiento sin perder nada. Cuando marca
   el último ejercicio, el servidor da el día por cumplido.

   Un día solo abre sesión en el servidor cuando el atleta pulsa `Comenzar`, o
   cuando ya existía una de antes. Así, mirar los días de la semana no deja
   entrenamientos a medias en el historial ni en la vista del entrenador.

   La política de seguridad del servidor no permite atributos `style`, de modo
   que el avance del anillo va en atributos del SVG y la barra es un elemento
   `<progress>`; nada se escribe como estilo en línea. */

import { initNavigation } from '../comun/navigation.js';
import { api, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';
import { icon } from '../comun/icons.js';
import { videoEmbedUrl } from '../comun/video.js';

await initNavigation();

const list = document.querySelector('#routines');
const detail = document.querySelector('#detail');
const message = document.querySelector('#message');
const modal = document.querySelector('#video-modal');
const videoContent = document.querySelector('#video-content');

/* Estado de la rutina abierta. */
let routine = null;
let progress = [];
let selectedWeek = 1;
let selectedDay = null;
let session = null;
/* routineExerciseId -> series guardadas. Vacío si el día no está empezado. */
let logged = new Map();
/* Últimos números escritos por ejercicio. Sobrevive a "Deshacer" para que
   desmarcar no borre de la pantalla lo que el atleta acababa de teclear. */
const drafts = new Map();

/* ---------- Video de demostración ---------- */

function openVideo(url, title) {
  const embedUrl = videoEmbedUrl(url);
  document.querySelector('#video-title').textContent = title;

  /* `referrerpolicy` en el propio marco es imprescindible: el servidor manda
     `Referrer-Policy: no-referrer` para toda la aplicación, y sin cabecera
     `Referer` el reproductor de YouTube no puede comprobar desde dónde se le
     incrusta y responde con un error en lugar del video. El atributo del
     elemento manda sobre la cabecera, así que se relaja solo aquí y solo
     hasta el origen, sin exponer la dirección de la página. */
  videoContent.innerHTML = embedUrl
    ? `
      <div class="video-frame">
        <iframe
          src="${embedUrl}"
          title="Video de ${escapeHtml(title)}"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <p class="video-fallback">
        ¿No se ve?
        <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Ábrelo en YouTube</a>.
      </p>`
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

modal.addEventListener('click', (event) => {
  if (event.target === modal) closeVideo();
});

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

  if (!instructions && !video) return '';
  return `<div class="exercise-support">${instructions}${video}</div>`;
}

/* Se vuelve a llamar después de cada dibujado, porque al reemplazar el
   HTML los botones anteriores desaparecen con sus manejadores. */
function bindHelpButtons() {
  document.querySelectorAll('.exercise-video').forEach((button) => {
    button.onclick = () => openVideo(button.dataset.url, button.dataset.title);
  });
}

/* ---------- Estado de cada franja de la semana ---------- */

function slotFor(weekNumber, dayOrder) {
  return progress.find((item) => item.weekNumber === weekNumber && item.dayOrder === dayOrder);
}

/* Guarda en la cuadrícula lo que acaba de responder el servidor, para que los
   anillos se actualicen sin volver a pedir el progreso entero. */
function updateSlot(result) {
  const entry = {
    weekNumber: selectedWeek,
    dayOrder: selectedDay,
    completedAt: result.session.completed_at,
    startedAt: result.session.started_at,
    completedExercises: result.completedExercises,
    totalExercises: result.totalExercises,
    status: result.session.completed_at ? 'completed' : 'in_progress',
  };

  const index = progress.findIndex(
    (item) => item.weekNumber === selectedWeek && item.dayOrder === selectedDay,
  );
  if (index >= 0) progress[index] = entry;
  else progress.push(entry);
}

/* ---------- Anillos de la semana ---------- */

/* Radio y perímetro del círculo del SVG. El perímetro se usa como longitud
   del trazo discontinuo: desplazándolo se descubre solo la parte cumplida. */
const RING_RADIUS = 19;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

function ringMarkup(fraction) {
  const offset = RING_LENGTH * (1 - Math.min(Math.max(fraction, 0), 1));

  return `
      <svg class="ring" viewBox="0 0 44 44" aria-hidden="true">
        <circle class="ring-track" cx="22" cy="22" r="${RING_RADIUS}"></circle>
        <circle
          class="ring-value"
          cx="22" cy="22" r="${RING_RADIUS}"
          stroke-dasharray="${RING_LENGTH.toFixed(1)}"
          stroke-dashoffset="${offset.toFixed(1)}"
        ></circle>
      </svg>`;
}

function dayState(day) {
  const slot = slotFor(selectedWeek, day.day_order);
  const isRest = day.day_type !== 'training';
  const total = day.exercises.length;
  const done = slot?.completedExercises ?? 0;
  const completed = Boolean(slot?.completedAt);

  return {
    slot,
    isRest,
    total,
    done,
    completed,
    fraction: completed ? 1 : total ? done / total : 0,
  };
}

function renderWeekDays() {
  return `
      <div class="week-days" role="tablist" aria-label="Días de la semana">
        ${routine.days
          .map((day) => {
            const state = dayState(day);
            const classes = [
              'week-day',
              day.day_order === selectedDay ? 'active' : '',
              state.completed ? 'is-done' : '',
              state.isRest ? 'is-rest' : '',
            ]
              .filter(Boolean)
              .join(' ');

            /* Dentro del anillo: una marca si está cumplido, una luna si es
               día libre pendiente, y si no el número del día. */
            let mark = `${day.day_order}`;
            if (state.completed) mark = icon('chequeo');
            else if (state.isRest) mark = icon('luna');

            const estado = state.completed
              ? 'cumplido'
              : state.isRest
                ? 'día libre'
                : `${state.done} de ${state.total} ejercicios`;

            return `
          <button
            type="button"
            class="${classes}"
            role="tab"
            aria-selected="${day.day_order === selectedDay}"
            aria-label="Día ${day.day_order}: ${escapeHtml(estado)}"
            data-day-order="${day.day_order}"
          >
            <span class="week-day-ring">
              ${ringMarkup(state.fraction)}
              <span class="week-day-mark">${mark}</span>
            </span>
            <small
              ><span class="week-day-short" aria-hidden="true">D</span
              ><span class="week-day-word">Día </span>${day.day_order}</small
            >
          </button>`;
          })
          .join('')}
      </div>`;
}

/* ---------- Selector de semana ---------- */

function renderWeekNav() {
  if ((routine.weeks || 1) <= 1) return '';

  return `
      <div class="week-nav">
        <button
          type="button" class="icon-btn" id="week-prev"
          aria-label="Semana anterior" ${selectedWeek <= 1 ? 'disabled' : ''}
        >${icon('anterior')}</button>
        <strong>Semana ${selectedWeek} de ${routine.weeks}</strong>
        <button
          type="button" class="icon-btn" id="week-next"
          aria-label="Semana siguiente" ${selectedWeek >= routine.weeks ? 'disabled' : ''}
        >${icon('siguiente')}</button>
      </div>`;
}

/* ---------- Ejercicios del día ---------- */

/* Una fila por serie planificada. Si el ejercicio ya se marcó, se rellenan
   con lo que quedó guardado para poder revisarlo o corregirlo. */
function renderSetRow(exercise, index, saved) {
  const numero = index + 1;
  const valores = saved?.find((item) => item.setNumber === numero);
  const reps = valores?.reps ?? '';
  const peso = valores?.weight ?? '';

  return `
            <div class="set-row" data-set="${numero}">
              <span class="set-number">${numero}</span>
              <div class="field">
                <label for="reps-${exercise.id}-${numero}">Reps</label>
                <input
                  id="reps-${exercise.id}-${numero}" data-field="reps"
                  type="number" min="0" max="1000" inputmode="numeric" value="${reps}"
                >
              </div>
              <div class="field">
                <label for="peso-${exercise.id}-${numero}">Peso (kg)</label>
                <input
                  id="peso-${exercise.id}-${numero}" data-field="weight"
                  type="number" min="0" max="2000" step=".25" inputmode="decimal" value="${peso}"
                >
              </div>
              <label class="set-pain">
                <input data-field="pain" type="checkbox" ${valores?.pain ? 'checked' : ''}>
                Dolor
              </label>
            </div>`;
}

function renderExerciseCard(exercise) {
  const saved = logged.get(exercise.id);
  const done = Boolean(saved);
  const descanso = exercise.restSeconds ?? '—';

  /* Terminado: se resume lo registrado y solo se ofrece deshacer. Pendiente:
     se muestran las casillas para anotar cada serie. */
  const cuerpo = done
    ? `
        <p class="exercise-done-summary">${
          saved.sets.length
            ? saved.sets.map((item) => `${item.reps} × ${Number(item.weight)} kg`).join(' · ')
            : 'Marcado como hecho, sin anotar series.'
        }</p>
        <button type="button" class="btn secondary small undo-exercise" data-exercise="${exercise.id}">
          ${icon('deshacer')}Deshacer
        </button>`
    : `
        <div class="set-list">
          ${Array.from({ length: exercise.sets }, (_, index) =>
            renderSetRow(exercise, index, drafts.get(exercise.id)),
          ).join('')}
        </div>
        <button type="button" class="btn small log-exercise" data-exercise="${exercise.id}">
          ${icon('chequeo')}Marcar como hecho
        </button>`;

  return `
      <article class="exercise-card${done ? ' is-done' : ''}" data-card="${exercise.id}">
        <header class="exercise-card-head">
          <div>
            <strong>${escapeHtml(exercise.name)}</strong>
            <p>
              ${exercise.sets} series · ${escapeHtml(String(exercise.reps))} reps ·
              descanso ${descanso} s
            </p>
          </div>
          ${done ? `<span class="exercise-tick">${icon('chequeo')}</span>` : ''}
        </header>
        ${helpButtons(exercise)}
        ${cuerpo}
      </article>`;
}

/* ---------- Vista del día ---------- */

function dayHeading(day) {
  const etiqueta =
    day.day_type === 'rest'
      ? '<span class="badge neutral">Día libre</span>'
      : day.day_type === 'optional_rest'
        ? '<span class="badge neutral">Día libre opcional</span>'
        : day.mirrors_day_order != null
          ? `<span class="badge">Igual al Día ${day.mirrors_day_order}</span>`
          : '';

  return `
      <div class="day-editor-head">
        <h3>Día ${day.day_order} · ${escapeHtml(day.name)}</h3>
        ${etiqueta}
      </div>`;
}

function renderRestDay(day) {
  const state = dayState(day);
  const texto =
    day.day_type === 'rest'
      ? 'Hoy toca descansar. El descanso es parte del plan.'
      : 'Día libre opcional: descansa o entrena por tu cuenta, como prefieras.';

  return `
      ${dayHeading(day)}
      <div class="notice">${texto}</div>
      ${
        state.completed
          ? `<p class="day-done">${icon('chequeo')} Marcado como cumplido.</p>`
          : `<button type="button" class="btn" id="complete-rest">${icon('chequeo')}Marcar como cumplido</button>`
      }`;
}

function renderTrainingDay(day) {
  const state = dayState(day);

  /* Sin sesión abierta el día se muestra en modo consulta: se puede leer el
     plan y ver los videos, pero todavía no hay nada que registrar. */
  if (!session) {
    return `
      ${dayHeading(day)}
      <div class="list">
        ${day.exercises
          .map(
            (exercise) => `
        <div class="list-item">
          <strong>${escapeHtml(exercise.name)}</strong>
          <p>
            ${exercise.sets} series · ${escapeHtml(String(exercise.reps))} reps ·
            descanso ${exercise.restSeconds ?? '—'} s
          </p>
          ${helpButtons(exercise)}
        </div>`,
          )
          .join('')}
      </div>
      <button type="button" class="btn mt" id="start-day">Comenzar día</button>`;
  }

  const hechos = logged.size;
  const total = day.exercises.length;

  return `
      ${dayHeading(day)}
      <div class="day-progress">
        <progress max="${total}" value="${hechos}"></progress>
        <small>${hechos} de ${total} ejercicios</small>
      </div>
      ${state.completed ? `<p class="day-done">${icon('chequeo')} Día completado. ¡Buen trabajo!</p>` : ''}
      <div class="exercise-cards">
        ${day.exercises.map(renderExerciseCard).join('')}
      </div>
      <form class="finish-day" id="finish-day">
        <h3>Cerrar el día</h3>
        <p class="muted">Opcional: cuenta cómo te fue. Puedes cerrarlo aunque falte algún ejercicio.</p>
        <div class="form-row">
          <div class="field">
            <label for="energy">Energía (1–10)</label>
            <input id="energy" name="energy" type="number" min="1" max="10" inputmode="numeric">
          </div>
        </div>
        <div class="field">
          <label for="notes">Notas para tu entrenador</label>
          <textarea id="notes" name="notes" maxlength="2000"></textarea>
        </div>
        <button class="btn secondary">Guardar y cerrar el día</button>
      </form>`;
}

function renderDayView() {
  const day = routine.days.find((item) => item.day_order === selectedDay);
  if (!day) return '';
  return day.day_type === 'training' ? renderTrainingDay(day) : renderRestDay(day);
}

/* ---------- Dibujado y manejadores ---------- */

function render() {
  detail.innerHTML = `
    <article class="card">
      <header class="page-header">
        <div>
          <h2>${escapeHtml(routine.name)}</h2>
          <p class="muted">${escapeHtml(routine.description || '')}</p>
        </div>
        ${renderWeekNav()}
      </header>
      ${renderWeekDays()}
      <div class="day-editor">${renderDayView()}</div>
    </article>`;

  bindDetail();
}

function bindDetail() {
  bindHelpButtons();

  detail.querySelectorAll('[data-day-order]').forEach((button) => {
    button.onclick = () => selectDay(Number(button.dataset.dayOrder));
  });

  const prev = detail.querySelector('#week-prev');
  if (prev) prev.onclick = () => changeWeek(selectedWeek - 1);
  const next = detail.querySelector('#week-next');
  if (next) next.onclick = () => changeWeek(selectedWeek + 1);

  const start = detail.querySelector('#start-day');
  if (start) start.onclick = () => openSession();

  const rest = detail.querySelector('#complete-rest');
  if (rest) rest.onclick = () => openSession();

  detail.querySelectorAll('.log-exercise').forEach((button) => {
    button.onclick = () => logExercise(button.dataset.exercise);
  });

  detail.querySelectorAll('.undo-exercise').forEach((button) => {
    button.onclick = () => undoExercise(button.dataset.exercise);
  });

  const finish = detail.querySelector('#finish-day');
  if (finish) finish.onsubmit = finishDay;
}

/* Guarda en el estado lo que devuelve cualquier operación de registro. */
function applyResult(result) {
  session = result.session;
  if (result.logged) logged = new Map(result.logged.map((item) => [item.routineExerciseId, item]));
  updateSlot(result);
}

async function selectDay(order) {
  selectedDay = order;
  session = null;
  logged = new Map();

  /* Si la franja ya tenía sesión, se recupera para mostrar lo registrado.
     Si no, no se crea ninguna: mirar un día no es empezarlo. */
  const day = routine.days.find((item) => item.day_order === order);
  if (day && slotFor(selectedWeek, order)) {
    try {
      applyResult(await startSessionRequest(day));
    } catch (error) {
      showMessage(message, error.message, 'error');
    }
  }

  render();
}

function startSessionRequest(day) {
  return api('/api/routines/workouts/start', {
    method: 'POST',
    body: JSON.stringify({ routineDayId: day.id, weekNumber: selectedWeek }),
  });
}

async function openSession() {
  const day = routine.days.find((item) => item.day_order === selectedDay);
  try {
    applyResult(await startSessionRequest(day));
    render();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
}

async function changeWeek(week) {
  if (week < 1 || week > routine.weeks) return;
  selectedWeek = week;
  await selectDay(selectedDay);
}

/* Lee las series escritas para un ejercicio. Las filas vacías se descartan:
   el atleta puede marcar el ejercicio como hecho sin anotar los números. */
function collectSets(exerciseId) {
  const card = detail.querySelector(`[data-card="${exerciseId}"]`);
  if (!card) return [];

  return [...card.querySelectorAll('.set-row')]
    .map((row) => ({
      setNumber: Number(row.dataset.set),
      reps: row.querySelector('[data-field="reps"]').value,
      weight: row.querySelector('[data-field="weight"]').value,
      pain: row.querySelector('[data-field="pain"]').checked,
    }))
    .filter((item) => item.reps !== '' || item.weight !== '')
    .map((item) => ({
      setNumber: item.setNumber,
      reps: Number(item.reps || 0),
      weight: Number(item.weight || 0),
      pain: item.pain,
    }));
}

async function logExercise(exerciseId) {
  const sets = collectSets(exerciseId);

  try {
    const result = await api(`/api/routines/workouts/${session.id}/exercises/${exerciseId}`, {
      method: 'PUT',
      body: JSON.stringify({ sets }),
    });
    /* La respuesta no trae el detalle, así que se anota aquí lo que se acaba
       de enviar; es exactamente lo que quedó guardado. */
    logged.set(exerciseId, { routineExerciseId: exerciseId, sets });
    drafts.set(exerciseId, sets);
    applyResult(result);
    render();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
}

async function undoExercise(exerciseId) {
  try {
    const result = await api(`/api/routines/workouts/${session.id}/exercises/${exerciseId}`, {
      method: 'DELETE',
    });
    /* Se conservan los números para volver a mostrarlos en las casillas. */
    drafts.set(exerciseId, logged.get(exerciseId)?.sets ?? drafts.get(exerciseId) ?? []);
    logged.delete(exerciseId);
    applyResult(result);
    render();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
}

async function finishDay(event) {
  event.preventDefault();
  const form = event.target;

  try {
    const result = await api(`/api/routines/workouts/${session.id}/finish`, {
      method: 'PUT',
      body: JSON.stringify({
        /* La energía es opcional: sin valor se envía nulo, no cero. */
        energy: form.energy.value ? Number(form.energy.value) : null,
        notes: form.notes.value,
      }),
    });
    session = result.session;
    updateSlot({
      session: result.session,
      completedExercises: logged.size,
      totalExercises:
        routine.days.find((item) => item.day_order === selectedDay)?.exercises.length ?? 0,
    });
    showMessage(message, 'Día guardado. Puedes verlo en tu historial.', 'notice');
    render();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
}

/* ---------- Apertura de una rutina ---------- */

async function openRoutine(id) {
  try {
    const [{ routine: loaded }, grid] = await Promise.all([
      api(`/api/routines/${id}`),
      api(`/api/routines/${id}/progress`),
    ]);

    routine = loaded;
    progress = grid.progress;
    selectedWeek = routine.currentWeek || 1;

    /* Se abre en el primer día que sí entrena, no en uno de descanso. */
    const primero = routine.days.find((day) => day.day_type === 'training') || routine.days[0];
    await selectDay(primero?.day_order ?? 1);

    detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
}

/* ---------- Lista de rutinas asignadas ---------- */

function renderRoutineCard(item) {
  const semanas = (item.weeks || 1) === 1 ? '1 semana' : `${item.weeks} semanas`;

  return `
    <article class="card">
      <div class="actions">
        <span class="badge">Activa</span>
        <span class="badge neutral">${semanas}</span>
      </div>
      <h2>${escapeHtml(item.name)}</h2>
      <p>${escapeHtml(item.description || '')}</p>
      <button class="btn" data-routine="${item.id}">Abrir</button>
    </article>`;
}

try {
  const { routines } = await api('/api/routines');

  list.innerHTML = routines.length
    ? routines.map(renderRoutineCard).join('')
    : '<div class="empty">Tu entrenador todavía no asignó una rutina.</div>';

  list.querySelectorAll('[data-routine]').forEach((button) => {
    button.onclick = () => openRoutine(button.dataset.routine);
  });
} catch (error) {
  showMessage(message, error.message, 'error');
}
