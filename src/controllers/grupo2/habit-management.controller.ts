import type { Request, Response } from 'express';
import { habitService } from '../../grupo1/habit.service.js';

function getHabitId(request: Request): string {
  const { id } = request.params;
  return Array.isArray(id) ? id[0] : id;
}

export function updateHabit(request: Request, response: Response): void {
  try {
    const habit = habitService.update(getHabitId(request), request.body ?? {});
    if (!habit) {
      response.status(404).json({ error: 'Hábito no encontrado.' });
      return;
    }
    response.json(habit);
  } catch (error) {
    if (error instanceof Error && 'errors' in error) {
      response.status(400).json({ errors: error.errors });
      return;
    }

    response.status(500).json({ error: 'No se pudo actualizar el hábito.' });
  }
}

export function deactivateHabit(request: Request, response: Response): void {
  const habit = habitService.deactivate(getHabitId(request));
  if (!habit) {
    response.status(404).json({ error: 'Hábito no encontrado.' });
    return;
  }
  response.json(habit);
}
