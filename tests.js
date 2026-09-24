/**
 * tests.js
 * Pruebas automatizadas para HU-03, ejecutadas contra el Controlador
 * (la misma capa que usa la Vista), que a su vez usa el Modelo (storage.js).
 * Se ejecutan solas al cargar la página; resultados en la consola (F12).
 */
(function runTests() {
  const Controller = window.HabitController;
  const { loadHabits, saveHabits, todayStr, isCompletedToday, computeStreaks } = window.HabitStorage;

  const results = [];
  const assert = (desc, cond) => results.push({ desc, pass: !!cond });

  function testHabit() {
    return { id: "t1", name: "Test", color: "#000", createdAt: todayStr(), completions: [] };
  }

  // Test 1: un hábito recién creado no está completado hoy
  let h = testHabit();
  assert("Hábito nuevo no está completado hoy", Controller.isCompletedToday(h) === false);

  // Test 2: marcar completado agrega la fecha de hoy
  h.completions.push(todayStr());
  assert("Fecha de hoy se agrega a completions", isCompletedToday(h) === true);

  // Test 3: no se puede duplicar el registro del mismo día (a nivel de datos)
  const before = h.completions.length;
  if (!h.completions.includes(todayStr())) h.completions.push(todayStr());
  assert("No se duplica el registro del mismo día", h.completions.length === before);

  // Test 4: racha actual y mejor racha tras el primer registro de hoy
  const streaks = Controller.getStreaks(h);
  assert("Racha actual = 1 tras primer registro", streaks.current === 1);
  assert("Mejor racha = 1 tras primer registro", streaks.best === 1);

  // Test 5: addHabit + markComplete a través del Controlador (flujo real de la app)
  const addResult = Controller.addHabit("__temp_test__", "#111111");
  assert("Controller.addHabit crea el hábito correctamente", addResult.ok === true);

  const tempHabit = addResult.habit;
  const r1 = Controller.markComplete(tempHabit.id);
  const r2 = Controller.markComplete(tempHabit.id); // segundo intento el mismo día
  assert("Primer registro del día retorna ok=true", r1.ok === true);
  assert("Segundo registro el mismo día es rechazado", r2.ok === false && r2.reason === "already_done");

  // Test 6: validación del Controlador ante nombre vacío
  const invalid = Controller.addHabit("   ", "#22c55e");
  assert("Controller.addHabit rechaza nombre vacío", invalid.ok === false && invalid.reason === "invalid_name");

  // Limpieza: removemos el hábito temporal de prueba
  const cleaned = loadHabits().filter(x => x.id !== tempHabit.id);
  saveHabits(cleaned);

  const passed = results.filter(r => r.pass).length;
  console.group("🧪 Pruebas HU-03 (Vue + MVC) — registro de cumplimiento diario");
  results.forEach(r => console.log(`${r.pass ? "✅" : "❌"} ${r.desc}`));
  console.log(`Resultado: ${passed}/${results.length} pruebas pasaron`);
  console.groupEnd();

  if (window.__vueApp && typeof window.__vueApp.refresh === "function") {
    window.__vueApp.refresh();
  }
})();
