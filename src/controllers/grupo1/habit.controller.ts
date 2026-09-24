import type { Request, Response } from 'express';
import { HabitService } from '../../grupo1/habit.service.js';

const habitService = new HabitService();

export function listHabits(_request: Request, response: Response): void {
  response.json(habitService.list());
}

export function createHabit(request: Request, response: Response): void {
  try {
    const habit = habitService.create(request.body ?? {});
    response.status(201).json(habit);
  } catch (error) {
    if (error instanceof Error && 'errors' in error) {
      response.status(400).json({ errors: error.errors });
      return;
    }

    response.status(500).json({ error: 'No se pudo crear el hábito.' });
  }
}
