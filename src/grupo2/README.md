# Grupo 2 - Listado y gestión de hábitos

## Trabajar aquí

Esta carpeta es exclusiva para listar y administrar hábitos activos.

## Responsabilidad

- Mostrar los hábitos guardados.
- Permitir editar sus datos.
- Permitir eliminar o desactivar un hábito.
- Mostrar un estado vacío cuando no existan hábitos.

## Entregables

- Implementación del listado y la gestión en `src/controllers/grupo2` y `src/routes/grupo2`.
- Integración con el contrato común de hábitos.
- Pruebas en `tests/grupo2`.
- Una breve explicación del uso en este archivo.

## Endpoints

- `GET /api/habits` lista únicamente los hábitos activos.
- `PATCH /api/habits/:id` edita nombre, descripción, meta semanal o color.
- `DELETE /api/habits/:id` desactiva un hábito sin borrar su historial.

Las ediciones reutilizan las validaciones del Grupo 1 y no permiten nombres
duplicados entre hábitos activos.

## Demostración

Crear, editar, desactivar y volver a consultar hábitos comprobando que los cambios se conservan.

## Pantalla de gestión (localStorage)

Además de los endpoints, el Grupo 2 tiene una pantalla web que trabaja directamente sobre el `localStorage` que usa la pantalla del Grupo 1 (`src/grupo1/habitos-grupo1`), como pide el alcance del MVP.

## Cómo se usa

### Ver la pantalla

```bash
npx tsx src/grupo2/servidor.ts
```

- Gestión de hábitos (Grupo 2): <http://localhost:3002>
- Nuevo hábito (Grupo 1): <http://localhost:3002/grupo1/habitos-grupo1/public/index.html>

Las dos pantallas se sirven desde el mismo servidor, así que comparten el mismo `localStorage`: lo que se crea en la del Grupo 1 aparece en el listado del Grupo 2.

### Qué hace

- Lista los hábitos activos ordenados por nombre, con su color, meta semanal y si ya se completó hoy.
- **Editar**: cambia nombre, descripción, meta semanal y color, con las mismas validaciones del Grupo 1. Conserva el `id`, la fecha de creación y los cumplimientos. `Escape` cancela la edición.
- **Desactivar / Reactivar**: el hábito deja de aparecer en el listado pero conserva su historial. Con "Mostrar hábitos desactivados" se pueden ver y reactivar.
- **Eliminar**: borra el hábito y su historial (pide confirmación).
- Muestra un mensaje cuando no hay hábitos para listar.

### Archivos

| Archivo | Contenido |
| --- | --- |
| `public/js/gestionHabitos.js` | Lógica: `listarHabitos`, `obtenerHabitoPorId`, `editarHabito`, `desactivarHabito`, `reactivarHabito`, `eliminarHabito`, `completadoHoy` |
| `public/js/app.js` | Controlador de la pantalla |
| `public/index.html`, `public/css/gestion.css` | Pantalla y estilos (reutiliza `styles.css` del Grupo 1) |
| `servidor.ts` | Servidor de la demostración |

### Contrato común

Usa `obtenerHabitos` y `guardarHabitos` (`habitStorage.js`) y `validarHabito` (`habitModel.js`) del Grupo 1. Los hábitos se guardan en `localStorage` con la clave `habitos`, y "desactivar" solo cambia `activo` a `false`.

### Pruebas

```bash
npx vitest run tests/grupo2
```
