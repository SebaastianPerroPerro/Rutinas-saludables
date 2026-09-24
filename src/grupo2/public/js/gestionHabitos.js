// Grupo 2 — Listado y gestión de hábitos
// Lógica pura sobre el contrato común: usa el mismo localStorage y las mismas
// validaciones del Grupo 1 para que los datos sean compatibles entre grupos.
import { obtenerHabitos, guardarHabitos } from '../../../grupo1/habitos-grupo1/public/js/habitStorage.js';
import { validarHabito } from '../../../grupo1/habitos-grupo1/public/js/habitModel.js';

export const MENSAJES_GESTION = {
    noEncontrado: 'El hábito no existe o ya fue eliminado.',
};

function errorNoEncontrado() {
    const error = new Error(MENSAJES_GESTION.noEncontrado);
    error.errores = { general: MENSAJES_GESTION.noEncontrado };
    return error;
}

function errorValidacion(errores) {
    const error = new Error('Datos de hábito inválidos');
    error.errores = errores;
    return error;
}

/** Fecha local en formato 'YYYY-MM-DD' (mismo formato que usa el Grupo 3). */
export function fechaISO(fecha = new Date()) {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/** Indica si el hábito tiene un cumplimiento registrado en la fecha de hoy. */
export function completadoHoy(habito, hoy = fechaISO()) {
    const fechasCompletadas = Array.isArray(habito.cumplimientos) ? habito.cumplimientos : [];
    return fechasCompletadas.includes(hoy);
}

/**
 * Lista los hábitos guardados ordenados por nombre.
 * Por defecto solo devuelve los activos.
 */
export function listarHabitos(storage = globalThis.localStorage, { incluirInactivos = false } = {}) {
    return obtenerHabitos(storage)
        .filter((habito) => incluirInactivos || habito.activo !== false)
        .sort((primera, segunda) =>
            primera.nombre.localeCompare(segunda.nombre, 'es', { sensitivity: 'base' })
        );
}

export function obtenerHabitoPorId(id, storage = globalThis.localStorage) {
    return obtenerHabitos(storage).find((habito) => habito.id === id) ?? null;
}

/** Aplica `cambio` al hábito con ese id y persiste la lista. Devuelve el hábito actualizado. */
function actualizarHabito(id, storage, cambio) {
    const habitos = obtenerHabitos(storage);
    const indice = habitos.findIndex((habito) => habito.id === id);
    if (indice === -1) throw errorNoEncontrado();

    const resultado = cambio(habitos[indice], habitos);
    habitos[indice] = resultado;
    guardarHabitos(habitos, storage);
    return resultado;
}

/**
 * Edita nombre, descripción, meta semanal y color de un hábito.
 * Conserva id, estado, fecha de creación y cumplimientos.
 */
export function editarHabito(id, datos, storage = globalThis.localStorage) {
    return actualizarHabito(id, storage, (habito, habitos) => {
        const otros = habitos.filter((otro) => otro.id !== id);
        const { valido, errores } = validarHabito(datos, otros);
        if (!valido) throw errorValidacion(errores);

        return {
            ...habito,
            nombre: String(datos.nombre).trim(),
            descripcion: String(datos.descripcion ?? '').trim(),
            metaSemanal: Number(datos.metaSemanal),
            color: String(datos.color).trim().toLowerCase(),
        };
    });
}

/** Desactiva el hábito: deja de aparecer en el listado, pero conserva su historial. */
export function desactivarHabito(id, storage = globalThis.localStorage) {
    return actualizarHabito(id, storage, (habito) => ({ ...habito, activo: false }));
}

/** Vuelve a activar un hábito, siempre que no exista otro activo con el mismo nombre. */
export function reactivarHabito(id, storage = globalThis.localStorage) {
    return actualizarHabito(id, storage, (habito, habitos) => {
        const nombre = habito.nombre.toLowerCase();
        const repetido = habitos.some(
            (otro) => otro.id !== id && otro.activo !== false && otro.nombre.toLowerCase() === nombre
        );
        if (repetido) {
            throw errorValidacion({ nombre: 'Ya existe un hábito activo con ese nombre.' });
        }
        return { ...habito, activo: true };
    });
}

/** Elimina definitivamente el hábito y sus cumplimientos. */
export function eliminarHabito(id, storage = globalThis.localStorage) {
    const habitos = obtenerHabitos(storage);
    const habito = habitos.find((h) => h.id === id);
    if (!habito) throw errorNoEncontrado();

    guardarHabitos(habitos.filter((h) => h.id !== id), storage);
    return habito;
}
