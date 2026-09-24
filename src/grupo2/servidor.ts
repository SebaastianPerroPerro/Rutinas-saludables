// Servidor de demostración del Grupo 2.
// Sirve la carpeta src/ para que la pantalla de gestión y la de creación (Grupo 1)
// compartan el mismo origen y, por lo tanto, el mismo localStorage.
import express from 'express';
import { fileURLToPath } from 'node:url';

const carpetaSrc = fileURLToPath(new URL('..', import.meta.url));
const puerto = Number(process.env.GRUPO2_PORT ?? 3002);

const app = express();

app.get('/', (_request, response) => {
  response.redirect('/grupo2/public/index.html');
});

app.use(express.static(carpetaSrc));

app.listen(puerto, () => {
  console.log(`Grupo 2 - gestión de hábitos: http://localhost:${puerto}`);
  console.log(`Grupo 1 - nuevo hábito:       http://localhost:${puerto}/grupo1/habitos-grupo1/public/index.html`);
});
