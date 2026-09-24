import type { Request, Response } from 'express';
import { habitService } from '../../grupo1/habit.service.js';
import { calculateWeeklySummary } from '../../grupo5/summary.service.js';

export function getWeeklySummary(request: Request, response: Response): void {
  try {
    const referenceDate = typeof request.query.date === 'string'
      ? request.query.date
      : new Date();

    const habits = habitService.list(true);
    const summary = calculateWeeklySummary(habits, referenceDate);

    response.status(200).json(summary);
  } catch (error) {
    if (error instanceof Error && error.message === 'Fecha inválida') {
      response.status(400).json({ error: 'La fecha proporcionada es inválida.' });
      return;
    }

    response.status(500).json({ error: 'No se pudo generar el resumen semanal.' });
  }
}
