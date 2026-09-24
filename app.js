/**
 * app.js
 * Vista (patrón MVC), implementada en Vue 3 (Composition API).
 * Solo habla con window.HabitController — nunca con window.HabitStorage directo.
 */
const { createApp, ref, onMounted } = Vue;
const Controller = window.HabitController;

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
      habits.value = Controller.getHabits();
    }

    function handleAddHabit() {
      const result = Controller.addHabit(newHabitName.value, newHabitColor.value);
      if (!result.ok) return;
      newHabitName.value = "";
      refresh();
    }

    // Accion principal de HU-03
    function handleCheck(habitId) {
      const result = Controller.markComplete(habitId);
      if (result.ok) {
        showToast("✅ Hábito registrado como completado hoy");
        refresh();
      } else if (result.reason === "already_done") {
        showToast("Este hábito ya fue registrado hoy", true);
      } else {
        showToast("No se pudo registrar el hábito", true);
      }
    }

    function doneToday(habit) {
      return Controller.isCompletedToday(habit);
    }

    function streaksOf(habit) {
      return Controller.getStreaks(habit);
    }

    onMounted(() => {
      Controller.seedDemoDataIfEmpty();
      refresh();
    });

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
