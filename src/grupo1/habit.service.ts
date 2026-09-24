import { randomUUID } from 'node:crypto';
import type {
  CreateHabitInput,
  Habit,
  ValidationErrors,
} from './habit.types.js';

const NOMBRE_MIN = 3;
const NOMBRE_MAX = 50;
const DESCRIPCION_MAX = 200;
const META_MIN = 1;
const META_MAX = 7;
const HEX_COLOR = /^#([0-9a-f]{6})$/i;

export const habitValidationMessages = {
  nombreVacio: 'El nombre es obligatorio.',
  metaFueraDeRango: 'La meta semanal debe estar en el rango válido (1 - 7).',
  colorNoSeleccionado: 'Selecciona un color antes de continuar.',
} as const;

export function validateHabit(
  input: CreateHabitInput,
  existingHabits: Habit[] = [],
): ValidationErrors {
  const errors: ValidationErrors = {};
  const nombre = String(input.nombre ?? '').trim();
  const descripcion = String(input.descripcion ?? '').trim();
  const metaTexto = String(input.metaSemanal ?? '').trim();
  const meta = Number(metaTexto);
  const color = String(input.color ?? '').trim();

  if (!nombre) {
    errors.nombre = habitValidationMessages.nombreVacio;
  } else if (nombre.length < NOMBRE_MIN || nombre.length > NOMBRE_MAX) {
    errors.nombre = `El nombre debe tener entre ${NOMBRE_MIN} y ${NOMBRE_MAX} caracteres.`;
  } else if (
    existingHabits.some(
      (habit) => habit.activo && habit.nombre.toLowerCase() === nombre.toLowerCase(),
    )
  ) {
    errors.nombre = 'Ya existe un hábito activo con ese nombre.';
  }

  if (descripcion.length > DESCRIPCION_MAX) {
    errors.descripcion = `La descripción no puede superar ${DESCRIPCION_MAX} caracteres.`;
  }

  if (!metaTexto || !Number.isInteger(meta) || meta < META_MIN || meta > META_MAX) {
    errors.metaSemanal = habitValidationMessages.metaFueraDeRango;
  }

  if (!color) {
    errors.color = habitValidationMessages.colorNoSeleccionado;
  } else if (!HEX_COLOR.test(color)) {
    errors.color = 'El color debe tener formato hexadecimal (#RRGGBB).';
  }

  return errors;
}

export function createHabit(
  input: CreateHabitInput,
  existingHabits: Habit[] = [],
  now = new Date(),
): Habit {
  const errors = validateHabit(input, existingHabits);
  if (Object.keys(errors).length > 0) {
    const error = new Error('Datos de hábito inválidos');
    Object.assign(error, { errors });
    throw error;
  }

  return {
    id: randomUUID(),
    nombre: String(input.nombre).trim(),
    descripcion: String(input.descripcion ?? '').trim(),
    metaSemanal: Number(input.metaSemanal),
    color: String(input.color).trim().toLowerCase(),
    activo: true,
    fechaCreacion: now.toISOString(),
    cumplimientos: [],
  };
}

export class HabitService {
  private readonly habits: Habit[] = [];

  list(): Habit[] {
    return [...this.habits];
  }

  create(input: CreateHabitInput): Habit {
    const habit = createHabit(input, this.habits);
    this.habits.push(habit);
    return habit;
  }
}
