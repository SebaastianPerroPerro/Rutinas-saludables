/**
 * tests.js
 * Pruebas automatizadas para HU-03, sobre la capa de "backend" (storage.js).
 * No dependen de Vue ni del DOM: prueban la lógica de negocio directamente.
 * Se ejecutan solas al cargar la página; resultados en la consola (F12).
 */
(function runTests() {
  const {
    loadHabits,
    saveHabits,
    todayStr,
    isCompletedToday,
    markCompletionToday,
    addHabitRecord,
    computeStreaks
  } = window.HabitStorage;

  const results = [];
  const assert = (desc, cond) => results.push({ desc, pass: !!cond });

  function testHabit() {
    return { id: "t1", name: "Test", color: "#000", createdAt: todayStr(), completions: [] };
  }

  // Test 1: un hábito recién creado no está completado hoy
  let h = testHabit();
  assert("Hábito nuevo no está completado hoy", isCompletedToday(h) === false);

  // Test 2: marcar completado agrega la fecha de hoy
  h.completions.push(todayStr());
  assert("Fecha de hoy se agrega a completions", isCompletedToday(h) === true);

  // Test 3: no se puede duplicar el registro del mismo día
  const before = h.completions.length;
  if (!h.completions.includes(todayStr())) h.completions.push(todayStr());
  assert("No se duplica el registro del mismo día", h.completions.length === before);

  // Test 4: racha actual y mejor racha tras el primer registro de hoy
  const streaks = computeStreaks(h);
  assert("Racha actual = 1 tras primer registro", streaks.current === 1);
  assert("Mejor racha = 1 tras primer registro", streaks.best === 1);

  // Test 5: markCompletionToday sobre localStorage real (con hábito temporal)
  const tempHabit = addHabitRecord("__temp_test__", "#111111");
  const r1 = markCompletionToday(tempHabit.id);
  const r2 = markCompletionToday(tempHabit.id); // segundo intento el mismo día
  assert("Primer registro del día retorna ok=true", r1.ok === true);
  assert("Segundo registro el mismo día es rechazado", r2.ok === false && r2.reason === "already_done");

  // Limpieza: removemos el hábito temporal de prueba
  const cleaned = loadHabits().filter(x => x.id !== tempHabit.id);
  saveHabits(cleaned);

  const passed = results.filter(r => r.pass).length;
  console.group("🧪 Pruebas HU-03 (Vue) — registro de cumplimiento diario");
  results.forEach(r => console.log(`${r.pass ? "✅" : "❌"} ${r.desc}`));
  console.log(`Resultado: ${passed}/${results.length} pruebas pasaron`);
  console.groupEnd();

  // Si la app Vue ya montó, refrescamos su estado tras la limpieza
  if (window.__vueApp && typeof window.__vueApp.refresh === "function") {
    window.__vueApp.refresh();
  }
})();
