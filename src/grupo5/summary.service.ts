import type { Habit } from '../grupo1/habit.types.js';
import type {
  HabitWeeklyProgress,
  WeekRange,
  WeeklySummary,
} from './summary.types.js';

function formatYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDateInput(value: Date | string): Date {
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      throw new Error('Fecha inválida');
    }
    return new Date(value.getTime());
  }

  const str = String(value).trim();
  // If YYYY-MM-DD, parse as local year, month, date to avoid UTC shifting issues
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
  if (match) {
    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    const day = Number(match[3]);
    const d = new Date(year, monthIndex, day);
    if (!isNaN(d.getTime())) {
      return d;
    }
  }

  const parsed = new Date(str);
  if (isNaN(parsed.getTime())) {
    throw new Error('Fecha inválida');
  }
  return parsed;
}

export function getWeekRange(referenceDate: Date | string = new Date()): WeekRange {
  const ref = parseDateInput(referenceDate);
  const day = ref.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const diffToMonday = (day === 0 ? -6 : 1) - day;

  const monday = new Date(ref);
  monday.setDate(ref.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    inicio: formatYMD(monday),
    fin: formatYMD(sunday),
  };
}

export function normalizeDateString(dateStr: string): string | null {
  try {
    const parsed = parseDateInput(dateStr);
    return formatYMD(parsed);
  } catch {
    return null;
  }
}

export function calculateHabitWeeklyProgress(
  habit: Habit,
  weekRange: WeekRange,
): HabitWeeklyProgress {
  const { inicio, fin } = weekRange;

  const uniqueDays = new Set<string>();
  const cumplimientos = Array.isArray(habit.cumplimientos) ? habit.cumplimientos : [];

  for (const item of cumplimientos) {
    const dateFormatted = normalizeDateString(item);
    if (dateFormatted && dateFormatted >= inicio && dateFormatted <= fin) {
      uniqueDays.add(dateFormatted);
    }
  }

  const diasCompletados = Array.from(uniqueDays).sort();
  const cumplimientosSemana = diasCompletados.length;
  const meta = habit.metaSemanal > 0 ? habit.metaSemanal : 1;
  const porcentaje = Math.min(100, Math.round((cumplimientosSemana / meta) * 100));
  const alcanzado = cumplimientosSemana >= meta;
  const faltantesParaMeta = Math.max(0, meta - cumplimientosSemana);

  return {
    id: habit.id,
    nombre: habit.nombre,
    descripcion: habit.descripcion ?? '',
    metaSemanal: habit.metaSemanal,
    color: habit.color,
    activo: habit.activo !== false,
    cumplimientosSemana,
    porcentaje,
    alcanzado,
    faltantesParaMeta,
    diasCompletados,
  };
}

export function calculateWeeklySummary(
  habits: Habit[],
  referenceDate: Date | string = new Date(),
): WeeklySummary {
  const weekRange = getWeekRange(referenceDate);
  const activeHabits = (habits || []).filter((h) => h.activo !== false);

  const progressList = activeHabits.map((habit) =>
    calculateHabitWeeklyProgress(habit, weekRange),
  );

  const habitosAlcanzados = progressList.filter((p) => p.alcanzado);
  const habitosPendientes = progressList.filter((p) => !p.alcanzado);

  const totalCumplimientosSemana = progressList.reduce(
    (acc, p) => acc + p.cumplimientosSemana,
    0,
  );

  const totalMetas = progressList.reduce((acc, p) => acc + p.metaSemanal, 0);
  const porcentajeCumplimientoGlobal =
    totalMetas > 0
      ? Math.min(100, Math.round((totalCumplimientosSemana / totalMetas) * 100))
      : 0;

  return {
    semana: weekRange,
    totalHabitosActivos: activeHabits.length,
    totalCumplimientosSemana,
    totalMetasAlcanzadas: habitosAlcanzados.length,
    totalMetasPendientes: habitosPendientes.length,
    porcentajeCumplimientoGlobal,
    habitosAlcanzados,
    habitosPendientes,
  };
}
