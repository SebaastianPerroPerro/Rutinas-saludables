import { Router } from 'express';
import { createHabit, listHabits } from '../../controllers/grupo1/habit.controller.js';

export const habitRouter = Router();

habitRouter.get('/', listHabits);
habitRouter.post('/', createHabit);
