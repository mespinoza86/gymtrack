import { initNavigation } from '../comun/navigation.js';
import { api, formData, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

await initNavigation();
const form = document.querySelector('#exercise-form');
const message = document.querySelector('#message');
const cancel = document.querySelector('#cancel');
let exercises = [];

function exerciseCard(exercise, editable) {
  return `<article class="card"><div><span class="badge">${exercise.is_active ? 'Activo' : 'Desactivado'}</span>${exercise.is_used ? ' <span class="badge">En uso</span>' : ''}</div><h3>${escapeHtml(exercise.name)}</h3><p><strong>${escapeHtml(exercise.muscle_group || 'Grupo muscular no indicado')}</strong></p><p>${escapeHtml(exercise.instructions || 'Sin instrucciones.')}</p>${exercise.media_url ? `<p><a href="${escapeHtml(exercise.media_url)}" target="_blank" rel="noopener noreferrer">Ver video de demostración</a></p>` : ''}${editable ? `<div class="actions"><button class="btn secondary small" data-edit="${exercise.id}">Editar</button><button class="btn secondary small" data-status="${exercise.id}" data-active="${exercise.is_active}">${exercise.is_active ? 'Desactivar' : 'Activar'}</button>${exercise.is_used ? '' : `<button class="btn danger small" data-delete="${exercise.id}">Eliminar</button>`}</div>` : ''}</article>`;
}

async function load() {
  ({ exercises } = await api('/api/routines/exercises/library'));
  const custom = exercises.filter((exercise) => !exercise.is_public);
  const general = exercises.filter((exercise) => exercise.is_public);
  document.querySelector('#custom-exercises').innerHTML = custom.length ? custom.map((exercise) => exerciseCard(exercise, true)).join('') : '<div class="empty">Todavía no has creado ejercicios personalizados.</div>';
  document.querySelector('#public-exercises').innerHTML = general.map((exercise) => exerciseCard(exercise, false)).join('');
  document.querySelectorAll('[data-edit]').forEach((button) => { button.onclick = () => editExercise(button.dataset.edit); });
  document.querySelectorAll('[data-status]').forEach((button) => { button.onclick = () => changeStatus(button); });
  document.querySelectorAll('[data-delete]').forEach((button) => { button.onclick = () => deleteExercise(button.dataset.delete); });
}

function resetForm() { form.reset(); form.elements.id.value = ''; document.querySelector('#form-title').textContent = 'Crear ejercicio'; document.querySelector('#save').textContent = 'Guardar ejercicio'; cancel.hidden = true; }
function editExercise(id) { const exercise = exercises.find((item) => item.id === id); form.elements.id.value = id; form.elements.name.value = exercise.name; form.elements.muscleGroup.value = exercise.muscle_group || ''; form.elements.instructions.value = exercise.instructions || ''; form.elements.mediaUrl.value = exercise.media_url || ''; document.querySelector('#form-title').textContent = 'Editar ejercicio'; document.querySelector('#save').textContent = 'Guardar cambios'; cancel.hidden = false; form.scrollIntoView({ behavior: 'smooth' }); }
async function changeStatus(button) { try { await api(`/api/routines/exercises/${button.dataset.status}/status`, { method: 'PUT', body: JSON.stringify({ isActive: button.dataset.active !== 'true' }) }); showMessage(message, button.dataset.active === 'true' ? 'Ejercicio desactivado.' : 'Ejercicio activado.'); await load(); } catch (error) { showMessage(message, error.message, 'error'); } }
async function deleteExercise(id) { if (!confirm('¿Eliminar definitivamente este ejercicio? Esta acción no se puede deshacer.')) return; try { await api(`/api/routines/exercises/${id}`, { method: 'DELETE' }); showMessage(message, 'Ejercicio eliminado.'); resetForm(); await load(); } catch (error) { showMessage(message, error.message, 'error'); } }

cancel.onclick = resetForm;
form.onsubmit = async (event) => { event.preventDefault(); const input = formData(form); const id = input.id; delete input.id; try { await api(id ? `/api/routines/exercises/${id}` : '/api/routines/exercises', { method: id ? 'PUT' : 'POST', body: JSON.stringify(input) }); showMessage(message, id ? 'Ejercicio actualizado.' : 'Ejercicio creado.'); resetForm(); await load(); } catch (error) { showMessage(message, error.message, 'error'); } };
await load();
