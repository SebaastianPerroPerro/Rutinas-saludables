/**
 * app.js
 * Frontend en Vue 3 (Composition API) para HU-03: registrar cumplimiento diario.
 * Toda la persistencia vive en storage.js (window.HabitStorage); este archivo
 * solo se encarga de la reactividad y la interacción con el usuario.
 */
const { createApp, ref, onMounted } = Vue;
const {
  loadHabits,
  addHabitRecord,
  markCompletionToday,
  isCompletedToday,
  computeStreaks
} = window.HabitStorage;

createApp({
  setup() {
    const habits = ref([]);
    const newHabitName = ref("");
    const newHabitColor = ref("#22c55e");

    const toastMsg = ref("");
    const toastVisible = ref(false);
    const toastWarn = ref(false);
    let toastTimer = null;

    function showToast(msg, warn = false) {
      toastMsg.value = msg;
      toastWarn.value = warn;
      toastVisible.value = true;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => (toastVisible.value = false), 2200);
    }

    function refresh() {
      // Vue detecta el cambio de referencia y re-renderiza de inmediato
      habits.value = loadHabits();
    }

    function handleAddHabit() {
      if (!newHabitName.value.trim()) return;
      addHabitRecord(newHabitName.value, newHabitColor.value);
      newHabitName.value = "";
      refresh();
    }

    // Acción principal de HU-03
    function handleCheck(habitId) {
      const result = markCompletionToday(habitId);
      if (result.ok) {
        showToast("✅ Hábito registrado como completado hoy");
        refresh(); // la interfaz refleja el cambio inmediatamente
      } else if (result.reason === "already_done") {
        showToast("Este hábito ya fue registrado hoy", true);
      } else {
        showToast("No se pudo registrar el hábito", true);
      }
    }

    function doneToday(habit) {
      return isCompletedToday(habit);
    }

    function streaksOf(habit) {
      return computeStreaks(habit);
    }

    onMounted(() => {
      // Datos de ejemplo si no hay nada guardado (solo para demo)
      if (loadHabits().length === 0) {
        addHabitRecord("Tomar agua", "#3b82f6");
        addHabitRecord("Leer 20 min", "#f59e0b");
        addHabitRecord("Meditar", "#a855f7");
      }
      refresh();
    });

    // Permite que tests.js (fuera de Vue) fuerce un refresco tras limpiar datos de prueba
    window.__vueApp = { refresh };

    return {
      habits,
      newHabitName,
      newHabitColor,
      toastMsg,
      toastVisible,
      toastWarn,
      handleAddHabit,
      handleCheck,
      doneToday,
      streaksOf
    };
  }
}).mount("#app");
