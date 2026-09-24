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

  describe('Criterios de Aceptación HU-05', () => {
    const semanaReferencia = '2026-09-24'; // Semana 2026-09-21 a 2026-09-27

    it('Criterio 1: Visualización del resumen semanal (días completados, porcentaje y meta semanal por hábito)', () => {
      const habitos: Habit[] = [
        {
          id: 'h-1',
          nombre: 'Leer libro',
          descripcion: 'Capítulo diario',
          metaSemanal: 5,
          color: '#3b82f6',
          activo: true,
          fechaCreacion: '2026-09-01T00:00:00.000Z',
          cumplimientos: ['2026-09-21', '2026-09-22', '2026-09-23'],
        },
      ];

      const resumen = calculateWeeklySummary(habitos, semanaReferencia);
      const habitProgress = resumen.habitosPendientes[0];

      expect(habitProgress.cumplimientosSemana).toBe(3);
      expect(habitProgress.metaSemanal).toBe(5);
      expect(habitProgress.porcentaje).toBe(60);
      expect(habitProgress.diasCompletados).toEqual(['2026-09-21', '2026-09-22', '2026-09-23']);
    });

    it('Criterio 2: Cálculo de cumplimiento (días completados sobre meta semanal y porcentaje)', () => {
      const habit: Habit = {
        id: 'h-2',
        nombre: 'Caminar',
        descripcion: '10k pasos',
        metaSemanal: 4,
        color: '#10b981',
        activo: true,
        fechaCreacion: '2026-09-01T00:00:00.000Z',
        cumplimientos: ['2026-09-21', '2026-09-23'], // 2 de 4
      };

      const weekRange = getWeekRange(semanaReferencia);
      const progress = calculateHabitWeeklyProgress(habit, weekRange);

      expect(progress.cumplimientosSemana).toBe(2);
      expect(progress.metaSemanal).toBe(4);
      expect(progress.porcentaje).toBe(50); // 2 / 4 = 50%
    });

    it('Criterio 3: Metas pendientes (muestra días restantes o pendientes para cumplir la meta)', () => {
      const habit: Habit = {
        id: 'h-3',
        nombre: 'Yoga',
        descripcion: 'Matutino',
        metaSemanal: 5,
        color: '#8b5cf6',
        activo: true,
        fechaCreacion: '2026-09-01T00:00:00.000Z',
        cumplimientos: ['2026-09-21'], // 1 de 5
      };

      const weekRange = getWeekRange(semanaReferencia);
      const progress = calculateHabitWeeklyProgress(habit, weekRange);

      expect(progress.alcanzado).toBe(false);
      expect(progress.faltantesParaMeta).toBe(4); // Faltan 4 días para la meta
    });

    it('Criterio 4: Semana sin registros (muestra 0% de cumplimiento)', () => {
      const habitos: Habit[] = [
        {
          id: 'h-4',
          nombre: 'Dormir temprano',
          descripcion: '8 horas',
          metaSemanal: 7,
          color: '#f59e0b',
          activo: true,
          fechaCreacion: '2026-09-01T00:00:00.000Z',
          cumplimientos: ['2026-09-10'], // Registros de otra semana
        },
      ];

      const resumen = calculateWeeklySummary(habitos, semanaReferencia);

      expect(resumen.totalCumplimientosSemana).toBe(0);
      expect(resumen.porcentajeCumplimientoGlobal).toBe(0);
      expect(resumen.habitosAlcanzados).toHaveLength(0);
      expect(resumen.habitosPendientes).toHaveLength(1);
      expect(resumen.habitosPendientes[0].cumplimientosSemana).toBe(0);
      expect(resumen.habitosPendientes[0].porcentaje).toBe(0);
      expect(resumen.habitosPendientes[0].faltantesParaMeta).toBe(7);
    });

    it('Criterio 5: Cambio de semana (actualiza el resumen según la semana seleccionada)', () => {
      const habitos: Habit[] = [
        {
          id: 'h-5',
          nombre: 'Programar',
          descripcion: 'Side project',
          metaSemanal: 3,
          color: '#ec4899',
          activo: true,
          fechaCreacion: '2026-09-01T00:00:00.000Z',
          cumplimientos: ['2026-09-15', '2026-09-16'], // Semana del 14 al 20 de sept
        },
      ];

      // Semana actual (sin registros para esa semana)
      const resumenActual = calculateWeeklySummary(habitos, '2026-09-24');
      expect(resumenActual.semana.inicio).toBe('2026-09-21');
      expect(resumenActual.totalCumplimientosSemana).toBe(0);

      // Semana anterior (con los 2 registros)
      const resumenAnterior = calculateWeeklySummary(habitos, '2026-09-17');
      expect(resumenAnterior.semana.inicio).toBe('2026-09-14');
      expect(resumenAnterior.semana.fin).toBe('2026-09-20');
      expect(resumenAnterior.totalCumplimientosSemana).toBe(2);
      expect(resumenAnterior.habitosPendientes[0].cumplimientosSemana).toBe(2);
      expect(resumenAnterior.habitosPendientes[0].porcentaje).toBe(67);
    });
  });
});
