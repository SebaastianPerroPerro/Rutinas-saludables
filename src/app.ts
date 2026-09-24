import cors from 'cors';
import express from 'express';
import { apiRouter } from './routes/index.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_request, response) => {
  response.json({ name: 'Rutinas saludables API', version: '1.0.0' });
});

app.use('/api', apiRouter);