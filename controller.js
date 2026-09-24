/**
 * controller.js
 * Controlador (patrón MVC).
 * Media entre el Modelo (storage.js / window.HabitStorage) y la Vista (app.js / Vue).
 * La Vista NUNCA debe llamar directo a window.HabitStorage: siempre pasa por aquí.
 */
window.HabitController = {
  // Devuelve la lista completa de hábitos (Modelo -> Controlador -> Vista)
  getHabits() {
    return window.HabitStorage.loadHabits();
  },

  // Crea un hábito nuevo, con validación básica antes de tocar el Modelo
  addHabit(name, color) {
    if (!name || !name.trim()) {
      return { ok: false, reason: "invalid_name" };
    }
    const habit = window.HabitStorage.addHabitRecord(name, color);
    return { ok: true, habit };
  },

  // HU-03: registrar el cumplimiento de hoy para un hábito
  markComplete(habitId) {
    return window.HabitStorage.markCompletionToday(habitId);
  },

  // Consulta si un hábito ya fue marcado hoy
  isCompletedToday(habit) {
    return window.HabitStorage.isCompletedToday(habit);
  },

  // Calcula racha actual y mejor racha de un hábito
  getStreaks(habit) {
    return window.HabitStorage.computeStreaks(habit);
  },

  // Siembra datos de ejemplo solo si no hay hábitos guardados (uso exclusivo para demo)
  seedDemoDataIfEmpty() {
    if (window.HabitStorage.loadHabits().length === 0) {
      window.HabitStorage.addHabitRecord("Tomar agua", "#3b82f6");
      window.HabitStorage.addHabitRecord("Leer 20 min", "#f59e0b");
      window.HabitStorage.addHabitRecord("Meditar", "#a855f7");
    }
  }
};
