import { Router } from 'express';
import { habitRouter } from './grupo1/habit.routes.js';
import { healthRouter } from './health.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/habits', habitRouter);