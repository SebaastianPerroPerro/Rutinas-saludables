import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';

const validInput = {
  nombre: 'Meditar',
  descripcion: 'Diez minutos',
  metaSemanal: 3,
  color: '#3b82f6',
};

describe('Grupo 1 - API de hábitos', () => {
  it('crea un hábito válido', async () => {
    const response = await request(app).post('/api/habits').send(validInput);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      nombre: 'Meditar',
      metaSemanal: 3,
      color: '#3b82f6',
      activo: true,
      cumplimientos: [],
    });
  });

  it('rechaza datos inválidos', async () => {
    const response = await request(app).post('/api/habits').send({
      nombre: '',
      metaSemanal: 0,
      color: '',
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toMatchObject({
      nombre: 'El nombre es obligatorio.',
      metaSemanal: 'La meta semanal debe estar en el rango válido (1 - 7).',
      color: 'Selecciona un color antes de continuar.',
    });
  });
});
