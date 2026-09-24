# Trabajo por grupos

## Reglas generales

1. Cada grupo trabaja en su carpeta `src/grupoX`.
2. Cada grupo agrega sus pruebas en `tests/grupoX`.
3. No se deben modificar archivos de otro grupo sin avisar.
4. Antes de subir cambios, ejecutar `npm test` y `npm run build`.
5. Cada grupo debe crear una rama propia: `grupo-1`, `grupo-2`, `grupo-3`, `grupo-4` o `grupo-5`.
6. El commit debe explicar el trabajo realizado, por ejemplo: `feat(grupo-1): crear habitos`.

## Orden recomendado

El trabajo debe integrarse en este orden:

1. Grupo 1 define y crea la información base de un hábito.
2. Grupo 2 usa esa información para listar y gestionar hábitos.
3. Grupo 3 usa los hábitos para registrar cumplimientos.
4. Grupo 4 usa los cumplimientos para calcular rachas.
5. Grupo 5 usa hábitos y cumplimientos para preparar el resumen semanal.

## Contrato común

Antes de programar, todos los grupos deben ponerse de acuerdo sobre:

- Identificador único del hábito.
- Nombre, descripción, meta semanal y color.
- Formato de las fechas.
- Forma de guardar datos en `localStorage`.
- Nombres de las funciones o servicios compartidos.

Cada `README.md` de grupo indica su responsabilidad, entregables, pruebas y criterios de demostración.