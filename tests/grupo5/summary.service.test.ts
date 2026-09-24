import { describe, expect, it } from 'vitest';
import type { Habit } from '../../src/grupo1/habit.types.js';
import {
  calculateHabitWeeklyProgress,
  calculateWeeklySummary,
  getWeekRange,
} from '../../src/grupo5/summary.service.js';

describe('Grupo 5 - servicio de resumen semanal', () => {
  describe('getWeekRange', () => {
    it('calcula correctamente el rango de lunes a domingo para un día entre semana', () => {
      // 2026-09-24 es jueves
      const range = getWeekRange('2026-09-24');
      expect(range.inicio).toBe('2026-09-21'); // Lunes
      expect(range.fin).toBe('2026-09-27');    // Domingo
    });

    it('calcula correctamente el rango cuando la fecha de referencia es domingo', () => {
      // 2026-09-27 es domingo
      const range = getWeekRange('2026-09-27');
      expect(range.inicio).toBe('2026-09-21');
      expect(range.fin).toBe('2026-09-27');
    });

    it('calcula correctamente el rango cuando la fecha de referencia es lunes', () => {
      // 2026-09-21 es lunes
      const range = getWeekRange('2026-09-21');
      expect(range.inicio).toBe('2026-09-21');
      expect(range.fin).toBe('2026-09-27');
    });
  });

  describe('calculateHabitWeeklyProgress', () => {
    const weekRange = { inicio: '2026-09-21', fin: '2026-09-27' };

    it('cuenta solo los cumplimientos dentro de la semana y descuenta duplicados', () => {
      const habit: Habit = {
        id: 'hab-1',
        nombre: 'Tomar agua',
        descripcion: '2 litros',
        metaSemanal: 4,
        color: '#3b82f6',
        activo: true,
        fechaCreacion: '2026-09-01T00:00:00.000Z',
        cumplimientos: [
          '2026-09-15', // Semana anterior (debe ignorarse)
          '2026-09-21', // Lunes (dentro)
          '2026-09-21T18:00:00.000Z', // Mismo lunes duplicado (debe contarse 1 vez)
          '2026-09-23', // Miércoles (dentro)
          '2026-09-24', // Jueves (dentro)
          '2026-09-30', // Semana siguiente (debe ignorarse)
        ],
      };

      const progress = calculateHabitWeeklyProgress(habit, weekRange);

      expect(progress.cumplimientosSemana).toBe(3);
      expect(progress.metaSemanal).toBe(4);
      expect(progress.faltantesParaMeta).toBe(1);
      expect(progress.porcentaje).toBe(75);
      expect(progress.alcanzado).toBe(false);
      expect(progress.diasCompletados).toEqual(['2026-09-21', '2026-09-23', '2026-09-24']);
    });

    it('marca hábito como alcanzado cuando cumple o supera la meta semanal', () => {
      const habit: Habit = {
        id: 'hab-2',
        nombre: 'Meditar',
        descripcion: '10 min',
        metaSemanal: 2,
        color: '#10b981',
        activo: true,
        fechaCreacion: '2026-09-01T00:00:00.000Z',
        cumplimientos: ['2026-09-22', '2026-09-23', '2026-09-24'],
      };

      const progress = calculateHabitWeeklyProgress(habit, weekRange);

      expect(progress.cumplimientosSemana).toBe(3);
      expect(progress.alcanzado).toBe(true);
      expect(progress.faltantesParaMeta).toBe(0);
      expect(progress.porcentaje).toBe(100);
    });
  });

  describe('calculateWeeklySummary', () => {
    it('genera el resumen clasificando alcanzados, pendientes y totales', () => {
      const habits: Habit[] = [
        {
          id: 'hab-1',
          nombre: 'Leer',
          descripcion: '30 min',
          metaSemanal: 3,
          color: '#8b5cf6',
          activo: true,
          fechaCreacion: '2026-09-01T00:00:00.000Z',
          cumplimientos: ['2026-09-21', '2026-09-22', '2026-09-23'], // 3/3 alcanzado
        },
        {
          id: 'hab-2',
          nombre: 'Ejercicio',
          descripcion: 'Cardio',
          metaSemanal: 5,
          color: '#ef4444',
          activo: true,
          fechaCreacion: '2026-09-01T00:00:00.000Z',
          cumplimientos: ['2026-09-21', '2026-09-23'], // 2/5 pendiente
        },
        {
          id: 'hab-3',
          nombre: 'Habito Inactivo',
          descripcion: '',
          metaSemanal: 3,
          color: '#6b7280',
          activo: false,
          fechaCreacion: '2026-09-01T00:00:00.000Z',
          cumplimientos: ['2026-09-21', '2026-09-22'], // Debe ignorarse
        },
      ];

      const summary = calculateWeeklySummary(habits, '2026-09-24');

      expect(summary.semana).toEqual({
        inicio: '2026-09-21',
        fin: '2026-09-27',
      });
      expect(summary.totalHabitosActivos).toBe(2);
      expect(summary.totalCumplimientosSemana).toBe(5); // 3 + 2
      expect(summary.totalMetasAlcanzadas).toBe(1);
      expect(summary.totalMetasPendientes).toBe(1);
      expect(summary.habitosAlcanzados).toHaveLength(1);
      expect(summary.habitosAlcanzados[0].nombre).toBe('Leer');
      expect(summary.habitosPendientes).toHaveLength(1);
      expect(summary.habitosPendientes[0].nombre).toBe('Ejercicio');
      expect(summary.porcentajeCumplimientoGlobal).toBe(63); // 5 / (3 + 5) = 62.5% -> 63%
    });

    it('maneja una lista vacía de hábitos sin errores', () => {
      const summary = calculateWeeklySummary([], '2026-09-24');

      expect(summary.totalHabitosActivos).toBe(0);
      expect(summary.totalCumplimientosSemana).toBe(0);
      expect(summary.totalMetasAlcanzadas).toBe(0);
      expect(summary.totalMetasPendientes).toBe(0);
      expect(summary.porcentajeCumplimientoGlobal).toBe(0);
      expect(summary.habitosAlcanzados).toEqual([]);
      expect(summary.habitosPendientes).toEqual([]);
    });
  });
});
