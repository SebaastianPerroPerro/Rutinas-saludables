# Grupo 5 - Resumen semanal

## Responsabilidad

- Calcular el total de cumplimientos de la semana en curso (Lunes a Domingo).
- Identificar hábitos activos que alcanzaron su meta semanal (`cumplimientos >= metaSemanal`).
- Identificar hábitos pendientes y calcular cuántos días faltan para alcanzar la meta.
- Calcular el progreso porcentual por hábito y el porcentaje de cumplimiento global.
- Filtrar cumplimientos fuera de la semana y evitar contabilizar registros duplicados en el mismo día.

## Contrato de Datos Compartido

Utiliza el modelo unificado de hábitos de los grupos anteriores:
- `id`: identificador único (`string`).
- `nombre`: nombre del hábito (`string`).
- `descripcion`: descripción (`string`).
- `metaSemanal`: veces por semana entre 1 y 7 (`number`).
- `color`: formato hexadecimal `#RRGGBB` (`string`).
- `activo`: estado del hábito (`boolean`).
- `cumplimientos`: lista de fechas de cumplimiento (`string[]`, ej: `YYYY-MM-DD` o ISO).

## Estructura de Entregables

- **Tipos TypeScript**: `src/grupo5/summary.types.ts`
- **Lógica de Servicio**: `src/grupo5/summary.service.ts`
  - `getWeekRange(referenceDate)`: Devuelve el rango `{ inicio, fin }` (Lunes a Domingo).
  - `calculateHabitWeeklyProgress(habit, weekRange)`: Calcula el progreso individual.
  - `calculateWeeklySummary(habits, referenceDate)`: Genera el resumen consolidado.
- **Controlador API**: `src/controllers/grupo5/summary.controller.ts`
- **Rutas Express**: `src/routes/grupo5/summary.routes.ts` (`GET /api/summary/weekly`)
- **Interfaz Web**: `src/grupo5/public/` (`index.html`, `css/styles.css`, `js/app.js`, `js/summaryModel.js`)
- **Pruebas Automatizadas**: `tests/grupo5/summary.service.test.ts` y `tests/grupo5/summary.api.test.ts`

## Endpoints

### `GET /api/summary/weekly`
Consulta el resumen de la semana actual o de una fecha de referencia.

- **Query params opcionales**: `?date=YYYY-MM-DD`

**Ejemplo de respuesta (200 OK):**
```json
{
  "semana": {
    "inicio": "2026-09-21",
    "fin": "2026-09-27"
  },
  "totalHabitosActivos": 2,
  "totalCumplimientosSemana": 5,
  "totalMetasAlcanzadas": 1,
  "totalMetasPendientes": 1,
  "porcentajeCumplimientoGlobal": 63,
  "habitosAlcanzados": [
    {
      "id": "h-1",
      "nombre": "Leer",
      "descripcion": "30 min",
      "metaSemanal": 3,
      "color": "#8b5cf6",
      "activo": true,
      "cumplimientosSemana": 3,
      "porcentaje": 100,
      "alcanzado": true,
      "faltantesParaMeta": 0,
      "diasCompletados": ["2026-09-21", "2026-09-22", "2026-09-23"]
    }
  ],
  "habitosPendientes": [
    {
      "id": "h-2",
      "nombre": "Ejercicio",
      "descripcion": "Cardio",
      "metaSemanal": 5,
      "color": "#ef4444",
      "activo": true,
      "cumplimientosSemana": 2,
      "porcentaje": 40,
      "alcanzado": false,
      "faltantesParaMeta": 3,
      "diasCompletados": ["2026-09-21", "2026-09-23"]
    }
  ]
}
```

## Pruebas y Demostración

Ejecutar las pruebas automatizadas con:
```bash
npm test
```

Comprobar tipos y build:
```bash
npm run lint
npm run build
```