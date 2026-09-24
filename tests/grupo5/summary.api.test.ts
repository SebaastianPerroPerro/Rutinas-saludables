import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';
import { habitService } from '../../src/grupo1/habit.service.js';

describe('Grupo 5 - API de resumen semanal', () => {
  it('obtiene el resumen semanal por defecto con estado 200', async () => {
    const response = await request(app).get('/api/summary/weekly');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('semana');
    expect(response.body.semana).toHaveProperty('inicio');
    expect(response.body.semana).toHaveProperty('fin');
    expect(response.body).toHaveProperty('totalHabitosActivos');
    expect(response.body).toHaveProperty('totalCumplimientosSemana');
    expect(response.body).toHaveProperty('habitosAlcanzados');
    expect(response.body).toHaveProperty('habitosPendientes');
    expect(response.body).toHaveProperty('porcentajeCumplimientoGlobal');
  });

  it('calcula el resumen para una fecha de referencia específica', async () => {
    // Creamos un hábito para asegurar que haya datos
    const habit = habitService.create({
      nombre: 'Caminar 30 min',
      descripcion: 'Por el parque',
      metaSemanal: 2,
      color: '#10b981',
    });

    // Simulamos 2 cumplimientos en la semana del 2026-09-21 al 2026-09-27
    habit.cumplimientos.push('2026-09-22', '2026-09-24');

    const response = await request(app).get('/api/summary/weekly?date=2026-09-24');

    expect(response.status).toBe(200);
    expect(response.body.semana).toEqual({
      inicio: '2026-09-21',
      fin: '2026-09-27',
    });

    const targetHabit = response.body.habitosAlcanzados.find(
      (h: { id: string }) => h.id === habit.id,
    );
    expect(targetHabit).toBeDefined();
    expect(targetHabit.cumplimientosSemana).toBe(2);
    expect(targetHabit.alcanzado).toBe(true);
    expect(targetHabit.porcentaje).toBe(100);
    expect(targetHabit.faltantesParaMeta).toBe(0);
  });

  it('devuelve error 400 si la fecha enviada es inválida', async () => {
    const response = await request(app).get('/api/summary/weekly?date=no-es-fecha');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'La fecha proporcionada es inválida.' });
  });
});
