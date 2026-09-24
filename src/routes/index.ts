import { Router } from 'express';
import { habitRouter } from './grupo1/habit.routes.js';
import { habitManagementRouter } from './grupo2/habit-management.routes.js';
import { summaryRouter } from './grupo5/summary.routes.js';
import { healthRouter } from './health.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/habits', habitRouter);
apiRouter.use('/habits', habitManagementRouter);
apiRouter.use('/summary', summaryRouter);