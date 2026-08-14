/* Biblioteca de ejercicios del entrenador.

   La pantalla separa los ejercicios personalizados, que el entrenador puede
   administrar, de los generales de la plataforma, que solo puede consultar.
   El mismo formulario sirve para crear y para editar: si el campo oculto
   `id` tiene valor, se está editando.

   Un ejercicio que ya forma parte de alguna rutina no se puede eliminar,
   solo desactivar, para no romper el historial de entrenamientos. Esa regla
   la aplica también el servidor; aquí únicamente se oculta el botón. */

import { initNavigation } from '../comun/navigation.js';
import { api, formData, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

await initNavigation();

const form = document.querySelector('#exercise-form');
const message = document.querySelector('#message');
const cancel = document.querySelector('#cancel');
const formTitle = document.querySelector('#form-title');
const saveButton = document.querySelector('#save');

/* Se conserva la última lista recibida para poder rellenar el formulario
   de edición sin volver a preguntarle al servidor. */
let exercises = [];

/* ---------- Dibujado ---------- */

function renderActions(exercise) {
  /* El botón de eliminar solo aparece si el ejercicio nunca se ha usado. */
  const eliminar = exercise.is_used
    ? ''
    : `<button class="btn danger small" data-delete="${exercise.id}">Eliminar</button>`;

  return `
      <div class="actions">
        <button class="btn secondary small" data-edit="${exercise.id}">Editar</button>
        <button
          class="btn secondary small"
          data-status="${exercise.id}"
          data-active="${exercise.is_active}"
        >${exercise.is_active ? 'Desactivar' : 'Activar'}</button>
        ${eliminar}
      </div>`;
}

function exerciseCard(exercise, editable) {
  const estado = exercise.is_active ? 'Activo' : 'Desactivado';
  const enUso = exercise.is_used ? ' <span class="badge">En uso</span>' : '';

  const video = exercise.media_url
    ? `<p>
         <a href="${escapeHtml(exercise.media_url)}" target="_blank" rel="noopener noreferrer">
           Ver video de demostración
         </a>
       </p>`
    : '';

  return `
    <article class="card">
      <div>
        <span class="badge">${estado}</span>${enUso}
      </div>
      <h3>${escapeHtml(exercise.name)}</h3>
      <p><strong>${escapeHtml(exercise.muscle_group || 'Grupo muscular no indicado')}</strong></p>
      <p>${escapeHtml(exercise.instructions || 'Sin instrucciones.')}</p>
      ${video}
      ${editable ? renderActions(exercise) : ''}
    </article>`;
}

/* Los manejadores se vuelven a conectar después de cada dibujado, porque
   al reemplazar el HTML los botones anteriores dejan de existir. */
function bindActions() {
  document.querySelectorAll('[data-edit]').forEach((button) => {
    button.onclick = () => editExercise(button.dataset.edit);
  });

  document.querySelectorAll('[data-status]').forEach((button) => {
    button.onclick = () => changeStatus(button);
  });

  document.querySelectorAll('[data-delete]').forEach((button) => {
    button.onclick = () => deleteExercise(button.dataset.delete);
  });
}

async function load() {
  ({ exercises } = await api('/api/routines/exercises/library'));

  const custom = exercises.filter((exercise) => !exercise.is_public);
  const general = exercises.filter((exercise) => exercise.is_public);

  document.querySelector('#custom-exercises').innerHTML = custom.length
    ? custom.map((exercise) => exerciseCard(exercise, true)).join('')
    : '<div class="empty">Todavía no has creado ejercicios personalizados.</div>';

  document.querySelector('#public-exercises').innerHTML = general
    .map((exercise) => exerciseCard(exercise, false))
    .join('');

  bindActions();
}

/* ---------- Formulario ---------- */

function resetForm() {
  form.reset();
  form.elements.id.value = '';
  formTitle.textContent = 'Crear ejercicio';
  saveButton.textContent = 'Guardar ejercicio';
  cancel.hidden = true;
}

function editExercise(id) {
  const exercise = exercises.find((item) => item.id === id);

  form.elements.id.value = id;
  form.elements.name.value = exercise.name;
  form.elements.muscleGroup.value = exercise.muscle_group || '';
  form.elements.instructions.value = exercise.instructions || '';
  form.elements.mediaUrl.value = exercise.media_url || '';

  formTitle.textContent = 'Editar ejercicio';
  saveButton.textContent = 'Guardar cambios';
  cancel.hidden = false;

  form.scrollIntoView({ behavior: 'smooth' });
}

/* ---------- Acciones sobre un ejercicio ---------- */

async function changeStatus(button) {
  const estabaActivo = button.dataset.active === 'true';

  try {
    await api(`/api/routines/exercises/${button.dataset.status}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: !estabaActivo }),
    });
    showMessage(message, estabaActivo ? 'Ejercicio desactivado.' : 'Ejercicio activado.');
    await load();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
}

async function deleteExercise(id) {
  if (!confirm('¿Eliminar definitivamente este ejercicio? Esta acción no se puede deshacer.')) {
    return;
  }

  try {
    await api(`/api/routines/exercises/${id}`, { method: 'DELETE' });
    showMessage(message, 'Ejercicio eliminado.');
    resetForm();
    await load();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
}

cancel.onclick = resetForm;

form.onsubmit = async (event) => {
  event.preventDefault();

  const input = formData(form);

  /* El identificador decide si se crea uno nuevo o se actualiza el actual;
     no forma parte del cuerpo que espera el servidor. */
  const id = input.id;
  delete input.id;

  try {
    await api(id ? `/api/routines/exercises/${id}` : '/api/routines/exercises', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(input),
    });
    showMessage(message, id ? 'Ejercicio actualizado.' : 'Ejercicio creado.');
    resetForm();
    await load();
  } catch (error) {
    showMessage(message, error.message, 'error');
  }
};

await load();
