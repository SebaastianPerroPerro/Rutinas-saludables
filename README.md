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
- `GET /api/habits` - Lista los hábitos creados.
- `POST /api/habits` - Crea un hábito validado.

## Estructura

```text
src/
├── config/         Configuración y variables de entorno
├── controllers/    Entrada y respuesta HTTP
├── middlewares/    Middlewares compartidos
├── models/         Tipos y modelos de dominio
├── routes/         Definición de endpoints
├── services/       Reglas de negocio
├── grupo1/         Grupo 1: creación de hábitos
├── grupo2/         Grupo 2: listado y gestión de hábitos
├── grupo3/         Grupo 3: registro de cumplimiento diario
├── grupo4/         Grupo 4: rachas de hábitos
├── grupo5/         Grupo 5: resumen semanal
├── utils/          Utilidades reutilizables
├── app.ts          Configuración de Express
└── server.ts       Arranque del servidor
tests/              Pruebas automatizadas
```

El Grupo 1 está integrado en `src/grupo1` y sus pruebas en `tests/grupo1`.
La API mantiene los hábitos en memoria durante la ejecución del servidor; la
persistencia definitiva se definirá junto con el contrato común de los grupos.

## Trabajo por grupos

Cada grupo debe trabajar dentro de su carpeta correspondiente:

| Carpeta | Responsabilidad |
| --- | --- |
| `src/grupo1` | Crear hábitos |
| `src/grupo2` | Listar, editar y eliminar hábitos |
| `src/grupo3` | Registrar cumplimientos diarios |
| `src/grupo4` | Calcular racha actual y mejor racha |
| `src/grupo5` | Generar el resumen semanal |

Antes de comenzar, cada grupo debe leer el `README.md` de su carpeta. Se recomienda crear una rama con el nombre del grupo, trabajar únicamente en su carpeta y agregar pruebas en `tests/grupoX`.

La coordinación y las reglas para unir el trabajo están en [TRABAJO-POR-GRUPOS.md](TRABAJO-POR-GRUPOS.md).