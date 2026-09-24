import { Router } from 'express';
import { getWeeklySummary } from '../../controllers/grupo5/summary.controller.js';

export const summaryRouter = Router();

summaryRouter.get('/weekly', getWeeklySummary);
