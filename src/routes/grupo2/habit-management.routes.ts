import { Router } from 'express';
import {
  deactivateHabit,
  updateHabit,
} from '../../controllers/grupo2/habit-management.controller.js';

export const habitManagementRouter = Router();

habitManagementRouter.patch('/:id', updateHabit);
habitManagementRouter.delete('/:id', deactivateHabit);
