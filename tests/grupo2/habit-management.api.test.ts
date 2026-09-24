import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';

describe('Grupo 2 - listado y gestión de hábitos', () => {
  it('lista, edita y desactiva un hábito', async () => {
    const created = await request(app).post('/api/habits').send({
      nombre: 'Caminar',
      descripcion: 'Treinta minutos',
      metaSemanal: 4,
      color: '#14b8a6',
    });
    const id = created.body.id as string;

    const listed = await request(app).get('/api/habits');
    expect(listed.status).toBe(200);
    expect(listed.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ id, nombre: 'Caminar' })]),
    );

    const updated = await request(app).patch(`/api/habits/${id}`).send({
      nombre: 'Caminar más',
      metaSemanal: 5,
    });
    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({
      id,
      nombre: 'Caminar más',
      descripcion: 'Treinta minutos',
      metaSemanal: 5,
      color: '#14b8a6',
    });

    const deactivated = await request(app).delete(`/api/habits/${id}`);
    expect(deactivated.status).toBe(200);
    expect(deactivated.body).toMatchObject({ id, activo: false });

    const activeHabits = await request(app).get('/api/habits');
    expect(activeHabits.body).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id })]),
    );
  });

  it('rechaza editar un hábito inexistente', async () => {
    const response = await request(app)
      .patch('/api/habits/no-existe')
      .send({ nombre: 'Nuevo nombre' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Hábito no encontrado.');
  });

  it('rechaza una edición con datos inválidos', async () => {
    const created = await request(app).post('/api/habits').send({
      nombre: 'Dormir',
      metaSemanal: 7,
      color: '#8b5cf6',
    });

    const response = await request(app)
      .patch(`/api/habits/${created.body.id}`)
      .send({ metaSemanal: 8 });

    expect(response.status).toBe(400);
    expect(response.body.errors.metaSemanal).toContain('1 - 7');
  });
});
