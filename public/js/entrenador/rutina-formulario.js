import { initNavigation } from '../comun/navigation.js';
import { api, formData, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

await initNavigation();
const routineId = new URLSearchParams(location.search).get('id');
const form = document.querySelector('#routine');
const rows = document.querySelector('#exercise-rows');
const message = document.querySelector('#message');
const [{ people }, { exercises }] = await Promise.all([api('/api/links/people'), api('/api/routines/exercises')]);
document.querySelector('#athlete').innerHTML = '<option value="">Seleccionar</option>' + people.map((person) => `<option value="${person.id}">${escapeHtml(person.first_name)} ${escapeHtml(person.last_name)}</option>`).join('');

function addRow(values = {}) {
  const node = document.querySelector('#row-template').content.cloneNode(true);
  const row = node.querySelector('.exercise-row');
  const select = row.querySelector('select');
  select.innerHTML = exercises.map((exercise) => `<option value="${exercise.id}">${escapeHtml(exercise.name)}${exercise.muscle_group ? ` · ${escapeHtml(exercise.muscle_group)}` : ''}</option>`).join('');
  for (const input of row.querySelectorAll('[data-name]')) if (values[input.dataset.name] !== undefined && values[input.dataset.name] !== null) input.value = values[input.dataset.name];
  row.querySelector('.remove').onclick = () => row.remove();
  rows.append(node);
}

document.querySelector('#add').onclick = () => addRow();
if (routineId) {
  document.title = 'Modificar rutina';
  document.querySelector('#page-title').textContent = 'Modificar rutina';
  document.querySelector('#page-description').textContent = 'Revisa el plan actual y guarda los cambios que necesites.';
  document.querySelector('#submit-button').textContent = 'Guardar cambios';
  try {
    const { routine } = await api(`/api/routines/${routineId}`);
    form.elements.name.value = routine.name;
    form.elements.athleteId.value = routine.athlete_id || '';
    form.elements.description.value = routine.description || '';
    form.elements.startDate.value = routine.start_date ? routine.start_date.slice(0, 10) : '';
    const day = routine.days[0];
    form.elements.dayName.value = day?.name || 'Día 1';
    (day?.exercises || []).forEach((exercise) => addRow({ exerciseId: exercise.exerciseId, sets: exercise.sets, reps: exercise.reps, restSeconds: exercise.restSeconds ?? 0 }));
  } catch (error) { showMessage(message, error.message, 'error'); form.hidden = true; }
} else addRow();

form.onsubmit = async (event) => {
  event.preventDefault();
  const raw = formData(form);
  const exerciseRows = [...document.querySelectorAll('.exercise-row')].map((row) => Object.fromEntries([...row.querySelectorAll('[data-name]')].map((input) => [input.dataset.name, input.value])));
  if (!exerciseRows.length) return showMessage(message, 'Agrega al menos un ejercicio', 'error');
  const body = { athleteId: raw.athleteId, name: raw.name, description: raw.description, status: 'active', startDate: raw.startDate, days: [{ name: raw.dayName, exercises: exerciseRows.map((item) => ({ exerciseId: item.exerciseId, sets: Number(item.sets), reps: item.reps, restSeconds: Number(item.restSeconds) })) }] };
  try {
    await api(routineId ? `/api/routines/${routineId}` : '/api/routines', { method: routineId ? 'PUT' : 'POST', body: JSON.stringify(body) });
    location.href = '/entrenador/rutinas.html';
  } catch (error) { showMessage(message, error.message, 'error'); }
};
