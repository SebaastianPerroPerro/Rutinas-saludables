import { describe, expect, it } from 'vitest';
import { createHabit, validateHabit } from '../../src/grupo1/habit.service.js';

const validInput = {
  nombre: 'Leer',
  descripcion: '20 minutos',
  metaSemanal: '5',
  color: '#22c55e',
};

describe('Grupo 1 - servicio de hábitos', () => {
  it('crea un hábito normalizado', () => {
    const habit = createHabit(validInput, [], new Date('2026-09-23T10:00:00.000Z'));

    expect(habit).toMatchObject({
      nombre: 'Leer',
      descripcion: '20 minutos',
      metaSemanal: 5,
      color: '#22c55e',
      activo: true,
      fechaCreacion: '2026-09-23T10:00:00.000Z',
      cumplimientos: [],
    });
    expect(habit.id).toBeTruthy();
  });

  it('rechaza nombre vacío, meta inválida y color ausente', () => {
    const errors = validateHabit({ nombre: ' ', metaSemanal: 8, color: '' });

    expect(errors).toMatchObject({
      nombre: 'El nombre es obligatorio.',
      metaSemanal: 'La meta semanal debe estar en el rango válido (1 - 7).',
      color: 'Selecciona un color antes de continuar.',
    });
  });

  it('no permite nombres duplicados entre hábitos activos', () => {
    const first = createHabit(validInput);

    expect(() => createHabit({ ...validInput, nombre: 'LEER' }, [first])).toThrow(
      'Datos de hábito inválidos',
    );
  });
});
