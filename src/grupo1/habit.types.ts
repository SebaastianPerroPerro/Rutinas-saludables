export interface Habit {
  id: string;
  nombre: string;
  descripcion: string;
  metaSemanal: number;
  color: string;
  activo: boolean;
  fechaCreacion: string;
  cumplimientos: string[];
}

export interface CreateHabitInput {
  nombre?: unknown;
  descripcion?: unknown;
  metaSemanal?: unknown;
  color?: unknown;
}

export type UpdateHabitInput = Partial<CreateHabitInput>;

export type ValidationErrors = Record<string, string>;
