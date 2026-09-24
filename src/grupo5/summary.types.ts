import type { Habit } from '../grupo1/habit.types.js';

export interface HabitWeeklyProgress {
  id: string;
  nombre: string;
  descripcion: string;
  metaSemanal: number;
  color: string;
  activo: boolean;
  cumplimientosSemana: number;
  porcentaje: number;
  alcanzado: boolean;
  faltantesParaMeta: number;
  diasCompletados: string[];
}

export interface WeekRange {
  inicio: string; // YYYY-MM-DD (Lunes)
  fin: string;    // YYYY-MM-DD (Domingo)
}

export interface WeeklySummary {
  semana: WeekRange;
  totalHabitosActivos: number;
  totalCumplimientosSemana: number;
  totalMetasAlcanzadas: number;
  totalMetasPendientes: number;
  porcentajeCumplimientoGlobal: number;
  habitosAlcanzados: HabitWeeklyProgress[];
  habitosPendientes: HabitWeeklyProgress[];
}
