import { initNavigation } from '../comun/navigation.js';
import { api, showMessage } from '../comun/api.js';
import { escapeHtml } from '../comun/dom.js';

await initNavigation();
const list = document.querySelector('#routines');
const detail = document.querySelector('#detail');
const message = document.querySelector('#message');
const modal = document.querySelector('#video-modal');
const videoContent = document.querySelector('#video-content');

function videoEmbedUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname) && url.pathname === '/watch') {
      const id = url.searchParams.get('v');
      if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
    }
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if (id) return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
    }
    if (url.hostname === 'vimeo.com' || url.hostname === 'www.vimeo.com') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if (/^\d+$/.test(id || '')) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {}
  return null;
}

function helpButtons(exercise) {
  const instructions = exercise.instructions ? `<details class="exercise-help"><summary>Ver instrucciones</summary><p>${escapeHtml(exercise.instructions)}</p></details>` : '';
  const video = exercise.mediaUrl ? `<button type="button" class="btn secondary small exercise-video" data-url="${escapeHtml(exercise.mediaUrl)}" data-title="${escapeHtml(exercise.name)}">Ver video</button>` : '';
  return instructions || video ? `<div class="exercise-support">${instructions}${video}</div>` : '<small class="muted">Este ejercicio no tiene instrucciones ni video.</small>';
}

function bindHelpButtons() {
  document.querySelectorAll('.exercise-video').forEach((button) => { button.onclick = () => openVideo(button.dataset.url, button.dataset.title); });
}

function openVideo(url, title) {
  const embedUrl = videoEmbedUrl(url);
  document.querySelector('#video-title').textContent = title;
  videoContent.innerHTML = embedUrl ? `<div class="video-frame"><iframe src="${embedUrl}" title="Video de ${escapeHtml(title)}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>` : `<div class="notice"><p>Este proveedor no permite reproducir el video dentro de GymTrack.</p><a class="btn" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Abrir video en otra pestaña</a></div>`;
  modal.showModal();
}

function closeVideo() { videoContent.replaceChildren(); modal.close(); }
document.querySelector('#close-video').onclick = closeVideo;
modal.addEventListener('click', (event) => { if (event.target === modal) closeVideo(); });
modal.addEventListener('cancel', (event) => { event.preventDefault(); closeVideo(); });

const { routines } = await api('/api/routines');
list.innerHTML = routines.length ? routines.map((routine) => `<article class="card"><span class="badge">Activa</span><h2>${escapeHtml(routine.name)}</h2><p>${escapeHtml(routine.description || '')}</p><button class="btn" data-routine="${routine.id}">Abrir</button></article>`).join('') : '<div class="empty">Tu entrenador todavía no asignó una rutina.</div>';
document.querySelectorAll('[data-routine]').forEach((button) => { button.onclick = () => openRoutine(button.dataset.routine); });

async function openRoutine(id) {
  const { routine } = await api(`/api/routines/${id}`);
  detail.innerHTML = routine.days.map((day) => `<article class="card"><h2>${escapeHtml(day.name)}</h2>${day.exercises.map((exercise) => `<div class="list-item"><strong>${escapeHtml(exercise.name)}</strong><p>${exercise.sets} series · ${escapeHtml(exercise.reps)} repeticiones · descanso ${exercise.restSeconds ?? '—'} s</p>${helpButtons(exercise)}</div>`).join('')}<button class="btn start" data-day="${day.id}">Comenzar y registrar</button></article>`).join('');
  bindHelpButtons();
  document.querySelectorAll('.start').forEach((button) => { button.onclick = () => startDay(button.dataset.day, routine); });
}

async function startDay(dayId, routine) {
  const { session } = await api('/api/routines/workouts/start', { method:'POST', body:JSON.stringify({ routineDayId:dayId }) });
  const day = routine.days.find((item) => item.id === dayId);
  detail.innerHTML = `<form class="card" id="workout"><h2>${escapeHtml(day.name)}</h2>${day.exercises.map((exercise) => `<section class="workout-exercise"><h3>${escapeHtml(exercise.name)}</h3><p>${exercise.sets} series · objetivo ${escapeHtml(exercise.reps)} repeticiones · descanso ${exercise.restSeconds ?? '—'} s</p>${helpButtons(exercise)}<div class="list">${Array.from({ length:exercise.sets }, (_, index) => `<div class="list-item set" data-exercise="${exercise.id}" data-number="${index + 1}"><strong>Serie ${index + 1}</strong><div class="form-row"><div class="field"><label>Repeticiones</label><input data-field="reps" type="number" min="0" required></div><div class="field"><label>Peso (kg)</label><input data-field="weight" type="number" min="0" step=".25" required></div></div><label><input data-field="pain" type="checkbox"> Sentí dolor o molestia</label></div>`).join('')}</div></section>`).join('')}<div class="field"><label>Energía (1–10)</label><input name="energy" type="number" min="1" max="10"></div><div class="field"><label>Notas</label><textarea name="notes"></textarea></div><button class="btn">Finalizar entrenamiento</button></form>`;
  bindHelpButtons();
  document.querySelector('#workout').onsubmit = async (event) => {
    event.preventDefault();
    const body = { energy:event.target.energy.value ? Number(event.target.energy.value) : null, notes:event.target.notes.value, sets:[...document.querySelectorAll('.set')].map((row) => ({ routineExerciseId:row.dataset.exercise, setNumber:Number(row.dataset.number), reps:Number(row.querySelector('[data-field=reps]').value), weight:Number(row.querySelector('[data-field=weight]').value), pain:row.querySelector('[data-field=pain]').checked })) };
    try { await api(`/api/routines/workouts/${session.id}/finish`, { method:'PUT', body:JSON.stringify(body) }); location.href = '/atleta/historial.html'; }
    catch (error) { showMessage(message, error.message, 'error'); }
  };
}
