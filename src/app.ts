import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import { apiRouter } from './routes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/grupo5', express.static(path.join(__dirname, 'grupo5/public')));
app.use('/grupo1', express.static(path.join(__dirname, 'grupo1/habitos-grupo1/public')));

app.get('/', (_request, response) => {
  response.json({ name: 'Rutinas saludables API', version: '1.0.0' });
});

app.use('/api', apiRouter);