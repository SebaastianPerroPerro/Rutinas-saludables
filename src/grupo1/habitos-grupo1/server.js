// Servidor Node.js (Express) que sirve la app estática.
// No hay backend real: los datos viven en localStorage del navegador.
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`App de hábitos corriendo en http://localhost:${PORT}`);
});
