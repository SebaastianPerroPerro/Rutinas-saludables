/**
 * storage.js
 * Capa de "backend" (persistencia en localStorage), independiente del framework.
 * Vue solo consume estas funciones puras — así se pueden probar sin UI.
 */

const STORAGE_KEY = "habits_v1";

/**
 * Estructura de un hábito:
 * {
 *   id: string,
 *   name: string,
 *   color: string,
 *   createdAt: "YYYY-MM-DD",
 *   completions: ["YYYY-MM-DD", ...]  // fechas ordenadas, únicas
 * }
 */

function loadHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error leyendo localStorage:", e);
    return [];
  }
}

function saveHabits(habits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function uid() {
  return "h_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Criterio de aceptación HU-03: "Solo se registra una vez por día para cada hábito."
function isCompletedToday(habit) {
  return habit.completions.includes(todayStr());
}

// Acción principal de HU-03: marcar cumplimiento de HOY
function markCompletionToday(habitId) {
  const habits = loadHabits();
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return { ok: false, reason: "not_found" };

  if (isCompletedToday(habit)) {
    return { ok: false, reason: "already_done" };
  }

  habit.completions.push(todayStr());
  habit.completions.sort();
  saveHabits(habits);
  return { ok: true, habit };
}

function addHabitRecord(name, color) {
  const habits = loadHabits();
  const habit = {
    id: uid(),
    name: name.trim(),
    color,
    createdAt: todayStr(),
    completions: []
  };
  habits.push(habit);
  saveHabits(habits);
  return habit;
}

// Cálculo de rachas (soporte para HU-04)
function computeStreaks(habit) {
  const dates = [...habit.completions].sort();
  if (dates.length === 0) return { current: 0, best: 0 };

  const toDate = s => new Date(s + "T00:00:00");
  let best = 1, run = 1;

  for (let i = 1; i < dates.length; i++) {
    const diffDays = (toDate(dates[i]) - toDate(dates[i - 1])) / 86400000;
    run = diffDays === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }

  let current = 0;
  let cursor = new Date();
  const dateSet = new Set(dates);
  const fmt = d => {
    const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  if (!dateSet.has(fmt(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dateSet.has(fmt(cursor))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { current, best };
}

// Exponemos las funciones en window para que app.js (Vue) y tests.js las usen
// sin necesidad de un bundler/módulos ES.
window.HabitStorage = {
  loadHabits,
  saveHabits,
  todayStr,
  uid,
  isCompletedToday,
  markCompletionToday,
  addHabitRecord,
  computeStreaks
};
