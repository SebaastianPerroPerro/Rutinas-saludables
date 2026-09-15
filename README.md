# Rutinas saludables

Base del backend para la aplicación de rutinas saludables.

## Stack

- Node.js
- Express
- TypeScript
- Vitest

## Puesta en marcha

1. Instala Node.js LTS.
2. Instala las dependencias:

	```bash
	npm install
	```

3. Copia `.env.example` como `.env`.
4. Inicia el servidor en desarrollo:

	```bash
	npm run dev
	```

La API queda disponible en `http://localhost:3000`.

## Comandos

| Comando | Uso |
| --- | --- |
| `npm run dev` | Servidor con recarga automática |
| `npm run build` | Compila TypeScript en `dist` |
| `npm start` | Ejecuta la compilación |
| `npm test` | Ejecuta las pruebas |
| `npm run lint` | Comprueba tipos sin emitir archivos |

## Rutas iniciales

- `GET /` - Información básica de la API.
- `GET /api/health` - Estado del servicio.

## Estructura

```text
src/
├── config/         Configuración y variables de entorno
├── controllers/    Entrada y respuesta HTTP
├── middlewares/    Middlewares compartidos
├── models/         Tipos y modelos de dominio
├── routes/         Definición de endpoints
├── services/       Reglas de negocio
├── utils/          Utilidades reutilizables
├── app.ts          Configuración de Express
└── server.ts       Arranque del servidor
tests/              Pruebas automatizadas
```

Cada integrante puede trabajar en un módulo separado y abrir una rama desde esta base.