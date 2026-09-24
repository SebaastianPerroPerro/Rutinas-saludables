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