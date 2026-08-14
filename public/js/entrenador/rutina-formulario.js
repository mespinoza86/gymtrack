/* Constructor de rutinas semanales.

   La semana siempre tiene siete franjas. Cada una puede ser de
   entrenamiento, día libre o día libre opcional, y un día de entrenamiento
   puede repetir a otro anterior en vez de escribir sus ejercicios otra vez.

   A diferencia del resto de pantallas, aquí el estado sí vive en JavaScript
   y no en el DOM: solo se dibuja el día seleccionado, así que los otros seis
   no existen en pantalla y no se podrían leer al guardar. El DOM se vuelca al
   estado con `captureCurrentDay()` antes de cualquier redibujado. */

import { initNavigation } from '../comun/navigation.js';
import { api, formData, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';
import { icon } from '../comun/icons.js';
import { routineCopyDraft } from '../comun/rutina-copia.js';

await initNavigation();

const DAYS_PER_WEEK = 7;
const WEEK_PRESETS = [1, 4, 6, 8];

const parameters = new URLSearchParams(location.search);
const routineId = parameters.get('id');
/* `id` siempre gana si alguien construye una URL con ambos parámetros: una
   pantalla nunca puede modificar y duplicar al mismo tiempo. */
const sourceRoutineId = routineId ? null : parameters.get('duplicar');
const form = document.querySelector('#routine');
const message = document.querySelector('#message');
const tabs = document.querySelector('#day-tabs');
const editor = document.querySelector('#day-editor');
const weeksOptions = document.querySelector('#weeks-options');
const weeksInput = document.querySelector('#weeks');

const [{ people }, { exercises }] = await Promise.all([
  api('/api/links/people'),
  api('/api/routines/exercises'),
]);

document.querySelector('#athlete').innerHTML =
  '<option value="">Seleccionar</option>' +
  people
    .map(
      (person) =>
        `<option value="${person.id}">${escapeHtml(person.first_name)} ${escapeHtml(person.last_name)}</option>`,
    )
    .join('');

/* ---------- Estado de la semana ---------- */

/* Siete franjas. Solo la primera nace como día de entrenamiento; el resto
   arranca libre para que el entrenador marque únicamente lo que sí entrena. */
function emptyWeek() {
  return Array.from({ length: DAYS_PER_WEEK }, (_, index) => ({
    name: `Día ${index + 1}`,
    dayType: index === 0 ? 'training' : 'rest',
    mirrorsDayOrder: null,
    notes: '',
    exercises: [],
  }));
}

let week = emptyWeek();
let selectedDay = 1;

const DAY_TYPES = [
  { value: 'training', label: 'Entrenamiento' },
  { value: 'rest', label: 'Día libre' },
  { value: 'optional_rest', label: 'Libre opcional' },
];

/* Los ejercicios que le tocan de verdad a una franja: un día espejo muestra
   los del día que repite, y un día libre no tiene ninguno. */
function effectiveExercises(day) {
  if (day.dayType !== 'training') return [];
  if (day.mirrorsDayOrder == null) return day.exercises;
  return week[day.mirrorsDayOrder - 1].exercises;
}

/* Solo se puede repetir un día de entrenamiento anterior que tenga lista
   propia. Encadenar espejos complicaría la pantalla sin aportar nada. */
function mirrorCandidates(dayOrder) {
  return week
    .map((day, index) => ({ day, order: index + 1 }))
    .filter(
      (item) =>
        item.order < dayOrder &&
        item.day.dayType === 'training' &&
        item.day.mirrorsDayOrder == null,
    );
}

/* ---------- Volcado del DOM al estado ---------- */

function readRow(row) {
  const value = (name) => row.querySelector(`[data-name="${name}"]`).value;
  const exerciseId = value('exerciseId');
  return {
    /* Estos parámetros todavía no tienen controles visibles en el formulario,
       pero pueden existir en rutinas antiguas. Se conservan para que modificar
       o duplicar no los borre silenciosamente. */
    ...(row.routineMetadata || {}),
    exerciseId,
    name: exercises.find((item) => item.id === exerciseId)?.name ?? '',
    sets: Number(value('sets')),
    reps: value('reps'),
    restSeconds: Number(value('restSeconds')),
  };
}

function captureCurrentDay() {
  const day = week[selectedDay - 1];
  const name = document.querySelector('#day-name');
  if (name) day.name = name.value;
  const notes = document.querySelector('#day-notes');
  if (notes) day.notes = notes.value;

  /* Solo escriben sobre el estado los días que editan su propia lista: un día
     libre no tiene filas y uno espejo enseña las del día que copia. */
  if (day.dayType === 'training' && day.mirrorsDayOrder == null)
    day.exercises = [...document.querySelectorAll('.exercise-row')].map(readRow);
}

/* ---------- Tira de días ---------- */

function dayBadge(day) {
  if (day.dayType === 'rest') return { icon: 'luna', text: 'Libre' };
  if (day.dayType === 'optional_rest') return { icon: 'luna', text: 'Libre opcional' };
  if (day.mirrorsDayOrder != null)
    return { icon: 'copiar', text: `Igual al Día ${day.mirrorsDayOrder}` };

  const total = day.exercises.length;
  if (!total) return { icon: 'pesa', text: 'Sin ejercicios', warn: true };
  return { icon: 'pesa', text: `${total} ejercicio${total === 1 ? '' : 's'}` };
}

function renderTabs() {
  tabs.innerHTML = week
    .map((day, index) => {
      const order = index + 1;
      const badge = dayBadge(day);
      const classes = [
        'day-tab',
        order === selectedDay ? 'active' : '',
        day.dayType !== 'training' ? 'is-rest' : '',
        badge.warn ? 'is-warn' : '',
      ]
        .filter(Boolean)
        .join(' ');

      /* La línea de estado se oculta en móvil, así que el estado completo
         va también en `aria-label`: quien use lector de pantalla lo oye
         igual en cualquier tamaño. */
      return `
        <button
          type="button"
          class="${classes}"
          role="tab"
          aria-selected="${order === selectedDay}"
          aria-label="Día ${order}: ${escapeHtml(badge.text)}"
          data-day="${order}"
        >
          <span class="day-tab-icon">${icon(badge.icon)}</span>
          <strong
            ><span class="day-tab-short" aria-hidden="true">D</span
            ><span class="day-tab-word">Día </span>${order}</strong
          >
          <small>${escapeHtml(badge.text)}</small>
        </button>`;
    })
    .join('');

  /* Los manejadores se vuelven a enlazar porque al reemplazar el HTML
     desaparecen los botones anteriores junto con los suyos. */
  tabs.querySelectorAll('[data-day]').forEach((button) => {
    button.onclick = () => selectDay(Number(button.dataset.day));
  });
}

function selectDay(order) {
  captureCurrentDay();
  selectedDay = order;
  render();
  editor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---------- Filas de ejercicio ---------- */

/* El catálogo solo trae ejercicios activos. Si la rutina que se está editando
   usa uno desactivado, se añade igualmente como opción para no perderlo al
   guardar sin que el entrenador se entere. */
function exerciseOptions(selectedId, fallbackName) {
  const known = exercises.some((item) => item.id === selectedId);
  const extra =
    selectedId && !known
      ? `<option value="${selectedId}" selected>${escapeHtml(fallbackName || 'Ejercicio desactivado')} · no disponible</option>`
      : '';

  return (
    extra +
    exercises
      .map(
        (exercise) =>
          `<option value="${exercise.id}"${exercise.id === selectedId ? ' selected' : ''}>` +
          `${escapeHtml(exercise.name)}${exercise.muscle_group ? ` · ${escapeHtml(exercise.muscle_group)}` : ''}` +
          '</option>',
      )
      .join('')
  );
}

/* Las filas se numeran al dibujarlas y cada vez que se quita una, para que
   no queden huecos en la cuenta después de borrar la del medio. */
function renumberRows() {
  document.querySelectorAll('.exercise-row-title').forEach((title, index) => {
    title.textContent = `Ejercicio ${index + 1}`;
  });
}

function addRow(values = {}) {
  const node = document.querySelector('#row-template').content.cloneNode(true);
  const row = node.querySelector('.exercise-row');

  row.routineMetadata = {
    targetWeight: values.targetWeight ?? null,
    rir: values.rir ?? null,
    tempo: values.tempo || '',
    notes: values.notes || '',
  };

  row.querySelector('[data-name="exerciseId"]').innerHTML = exerciseOptions(
    values.exerciseId,
    values.name,
  );
  for (const field of ['sets', 'reps', 'restSeconds'])
    if (values[field] !== undefined && values[field] !== null)
      row.querySelector(`[data-name="${field}"]`).value = values[field];

  const remove = row.querySelector('.remove');
  remove.innerHTML = icon('basura');

  /* Quitar una fila cambia la cuenta que muestra la tira de días, y también
     la de cualquier día que repita a este. */
  remove.onclick = () => {
    row.remove();
    renumberRows();
    captureCurrentDay();
    renderTabs();
  };

  document.querySelector('#exercise-rows').append(node);
  renumberRows();
}

/* ---------- Editor del día seleccionado ---------- */

function renderTypeSelector(day) {
  return `
    <div class="field">
      <label>Tipo de día</label>
      <div class="segmented" role="group" aria-label="Tipo de día">
        ${DAY_TYPES.map(
          (type) => `
          <button
            type="button"
            class="segmented-option${day.dayType === type.value ? ' active' : ''}"
            aria-pressed="${day.dayType === type.value}"
            data-type="${type.value}"
          >${type.label}</button>`,
        ).join('')}
      </div>
    </div>`;
}

function renderMirrorSelector(day) {
  const candidates = mirrorCandidates(selectedDay);
  if (!candidates.length) return '';

  return `
    <div class="field">
      <label for="mirror">Repetir otro día</label>
      <select id="mirror">
        <option value="">No, tiene sus propios ejercicios</option>
        ${candidates
          .map(
            (item) =>
              `<option value="${item.order}"${day.mirrorsDayOrder === item.order ? ' selected' : ''}>` +
              `Igual al Día ${item.order} · ${escapeHtml(item.day.name)}</option>`,
          )
          .join('')}
      </select>
      <small>El atleta verá el día marcado como copia, con los mismos ejercicios.</small>
    </div>`;
}

function renderMirrorPreview(day) {
  const copied = effectiveExercises(day);

  return `
    <div class="notice">
      Este día repite el <strong>Día ${day.mirrorsDayOrder}</strong>. Sus ejercicios se copian
      solos: si cambias el día ${day.mirrorsDayOrder}, este se actualiza también.
    </div>
    <div class="list mt">
      ${
        copied.length
          ? copied
              .map(
                (item) => `
        <div class="list-item">
          <strong>${escapeHtml(item.name || 'Ejercicio')}</strong>
          <p>${item.sets} series · ${escapeHtml(String(item.reps))} repeticiones</p>
        </div>`,
              )
              .join('')
          : '<div class="empty">El día que repites todavía no tiene ejercicios.</div>'
      }
    </div>`;
}

function renderExerciseEditor() {
  return `
    <h3>Ejercicios</h3>
    <div id="exercise-rows" class="list"></div>
    <div class="actions mt">
      <button class="btn secondary" type="button" id="add">${icon('agregar')}Agregar ejercicio</button>
    </div>`;
}

function renderRestNotice(day) {
  return day.dayType === 'rest'
    ? `<div class="notice">Día libre. El atleta lo verá como descanso y podrá marcarlo como cumplido.</div>`
    : `<div class="notice">Día libre opcional. El atleta decide si descansa o entrena por su cuenta.</div>`;
}

function renderEditor() {
  const day = week[selectedDay - 1];
  const isTraining = day.dayType === 'training';
  const isMirror = isTraining && day.mirrorsDayOrder != null;

  let body = '';
  if (!isTraining) body = renderRestNotice(day);
  else if (isMirror) body = renderMirrorPreview(day);
  else body = renderExerciseEditor();

  /* En móvil las fichas no muestran su línea de estado, así que se repite
     aquí: es la única forma de saber en qué estado está el día abierto. */
  const badge = dayBadge(day);

  editor.innerHTML = `
    <div class="day-editor">
      <div class="day-editor-head">
        <h3>Día ${selectedDay}</h3>
        <span class="badge${badge.warn ? ' warn' : ''}">${escapeHtml(badge.text)}</span>
      </div>
      <div class="form-row">
        <div class="field">
          <label for="day-name">Nombre del día</label>
          <input id="day-name" value="${escapeHtml(day.name)}" maxlength="100" required>
        </div>
        ${renderTypeSelector(day)}
      </div>
      ${isTraining ? renderMirrorSelector(day) : ''}
      ${body}
      <div class="field mt">
        <label for="day-notes">Notas para el atleta</label>
        <textarea id="day-notes" maxlength="1000">${escapeHtml(day.notes || '')}</textarea>
      </div>
    </div>`;

  if (isTraining && !isMirror) {
    day.exercises.forEach(addRow);
    document.querySelector('#add').onclick = () => addRow();
  }

  bindEditor();
}

function bindEditor() {
  editor.querySelectorAll('[data-type]').forEach((button) => {
    button.onclick = () => setDayType(button.dataset.type);
  });

  const mirror = editor.querySelector('#mirror');
  if (mirror) mirror.onchange = () => setMirror(mirror.value ? Number(mirror.value) : null);

  /* El nombre del día aparece también en la tira, así que se refleja
     mientras se escribe en lugar de esperar al cambio de día. */
  const name = editor.querySelector('#day-name');
  if (name)
    name.oninput = () => {
      week[selectedDay - 1].name = name.value;
      renderTabs();
    };
}

function setDayType(type) {
  captureCurrentDay();
  const day = week[selectedDay - 1];
  day.dayType = type;

  if (type !== 'training') {
    day.mirrorsDayOrder = null;
    /* Los días que repetían a este se quedan sin nada que copiar. */
    week.forEach((other) => {
      if (other.mirrorsDayOrder === selectedDay) other.mirrorsDayOrder = null;
    });
  }

  render();
}

function setMirror(source) {
  captureCurrentDay();
  const day = week[selectedDay - 1];
  day.mirrorsDayOrder = source;

  /* Solo se ofrecen días con lista propia, así que al convertir este en
     espejo hay que soltar a los que lo repetían. */
  if (source != null)
    week.forEach((other) => {
      if (other.mirrorsDayOrder === selectedDay) other.mirrorsDayOrder = null;
    });

  render();
}

function render() {
  renderTabs();
  renderEditor();
}

/* ---------- Duración del plan ---------- */

function renderWeeks() {
  const value = Number(weeksInput.value) || 1;
  const isPreset = WEEK_PRESETS.includes(value);

  /* Fichas sueltas y no un control segmentado: son cinco opciones y en un
     teléfono no caben en una fila, así que tienen que poder repartirse en
     varias líneas sin romper la forma del control. */
  weeksOptions.innerHTML =
    WEEK_PRESETS.map(
      (weeks) => `
      <button
        type="button"
        class="chip${isPreset && weeks === value ? ' active' : ''}"
        aria-pressed="${isPreset && weeks === value}"
        data-weeks="${weeks}"
      >${weeks} ${weeks === 1 ? 'semana' : 'semanas'}</button>`,
    ).join('') +
    `<button
        type="button"
        class="chip${isPreset ? '' : ' active'}"
        aria-pressed="${!isPreset}"
        data-weeks="otro"
      >Otro</button>`;

  weeksInput.hidden = isPreset;

  weeksOptions.querySelectorAll('[data-weeks]').forEach((button) => {
    button.onclick = () => {
      if (button.dataset.weeks === 'otro') {
        /* Se parte de un valor que no es ninguno de los atajos para que el
           campo quede visible y editable. */
        if (WEEK_PRESETS.includes(Number(weeksInput.value))) weeksInput.value = 12;
      } else weeksInput.value = button.dataset.weeks;
      renderWeeks();
      if (!weeksInput.hidden) weeksInput.focus();
    };
  });
}

weeksInput.oninput = () => {
  const value = Number(weeksInput.value);
  weeksOptions.querySelectorAll('[data-weeks]').forEach((button) => {
    const active = button.dataset.weeks === 'otro' && !WEEK_PRESETS.includes(value);
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
};

/* ---------- Carga inicial ---------- */

/* Escribe un borrador en el formulario y en el estado semanal. Se comparte
   entre edición y duplicación; la diferencia es cómo se construye el borrador
   y qué método HTTP se usa después al guardar. */
function loadDraft(draft) {
  form.elements.name.value = draft.name;
  form.elements.athleteId.value = draft.athleteId;
  form.elements.description.value = draft.description;
  form.elements.startDate.value = draft.startDate;
  weeksInput.value = draft.weeks;
  week = draft.week;

  const firstTraining = week.findIndex((day) => day.dayType === 'training');
  selectedDay = firstTraining >= 0 ? firstTraining + 1 : 1;
}

function editableDraft(routine) {
  const draft = routineCopyDraft(routine);
  draft.name = routine.name;
  draft.startDate = routine.start_date ? routine.start_date.slice(0, 10) : '';
  return draft;
}

if (routineId) {
  document.title = 'Modificar rutina';
  document.querySelector('#page-title').textContent = 'Modificar rutina';
  document.querySelector('#page-description').textContent =
    'Revisa la semana y guarda los cambios que necesites.';
  document.querySelector('#submit-button').textContent = 'Guardar cambios';

  try {
    const { routine } = await api(`/api/routines/${routineId}`);
    loadDraft(editableDraft(routine));
  } catch (error) {
    showMessage(message, error.message, 'error');
    form.hidden = true;
  }
} else if (sourceRoutineId) {
  document.title = 'Duplicar rutina';
  document.querySelector('#page-title').textContent = 'Duplicar rutina';
  document.querySelector('#page-description').textContent =
    'Revisa la copia, cambia lo que necesites y guárdala como un plan independiente.';
  document.querySelector('#submit-button').textContent = 'Crear copia';
  document.querySelector('#copy-notice').hidden = false;

  try {
    const { routine } = await api(`/api/routines/${sourceRoutineId}`);
    loadDraft(routineCopyDraft(routine));
  } catch (error) {
    showMessage(message, error.message, 'error');
    form.hidden = true;
  }
}

renderWeeks();
render();

/* ---------- Guardado ---------- */

/* Un día de entrenamiento sin ejercicios ni día espejo lo rechazaría el
   servidor. Se avisa antes y se abre el día que falta. */
function findIncompleteDay() {
  return week.findIndex(
    (day) => day.dayType === 'training' && day.mirrorsDayOrder == null && !day.exercises.length,
  );
}

form.onsubmit = async (event) => {
  event.preventDefault();
  captureCurrentDay();

  const incomplete = findIncompleteDay();
  if (incomplete >= 0) {
    selectDay(incomplete + 1);
    return showMessage(
      message,
      `El Día ${incomplete + 1} es de entrenamiento pero no tiene ejercicios. Agrega uno, marca el día como libre o haz que repita otro día.`,
      'error',
    );
  }

  const raw = formData(form);
  const body = {
    athleteId: raw.athleteId,
    name: raw.name,
    description: raw.description,
    status: 'active',
    startDate: raw.startDate,
    weeks: Number(weeksInput.value) || 1,
    days: week.map((day) => ({
      name: day.name,
      notes: day.notes,
      dayType: day.dayType,
      mirrorsDayOrder: day.dayType === 'training' ? day.mirrorsDayOrder : null,
      /* Un día espejo se envía vacío a propósito: el servidor copia la lista
         del día repetido, que es la versión buena aunque se acabe de editar. */
      exercises:
        day.dayType === 'training' && day.mirrorsDayOrder == null
          ? day.exercises.map((item) => ({
              exerciseId: item.exerciseId,
              sets: Number(item.sets),
              reps: item.reps,
              targetWeight:
                item.targetWeight === null || item.targetWeight === undefined
                  ? null
                  : Number(item.targetWeight),
              restSeconds:
                item.restSeconds === null || item.restSeconds === undefined
                  ? null
                  : Number(item.restSeconds),
              rir: item.rir === null || item.rir === undefined ? null : Number(item.rir),
              tempo: item.tempo || '',
              notes: item.notes || '',
            }))
          : [],
    })),
  };

  try {
    await api(routineId ? `/api/routines/${routineId}` : '/api/routines', {
      method: routineId ? 'PUT' : 'POST',
      body: JSON.stringify(body),
    });
    location.href = '/entrenador/rutinas.html';
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};
