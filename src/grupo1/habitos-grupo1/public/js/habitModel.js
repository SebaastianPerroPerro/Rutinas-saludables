// Grupo 1 — Creación de hábitos
// Lógica pura (sin DOM ni localStorage) para poder probarla fácilmente.

export const NOMBRE_MIN = 3;
export const NOMBRE_MAX = 50;
export const DESCRIPCION_MAX = 200;
export const META_MIN = 1;
export const META_MAX = 7;
export const COLORES = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'];

// Mensajes definidos por los criterios de aceptación de la HU-01
export const MENSAJES = {
    nombreVacio: 'El nombre es obligatorio.',
    metaFueraDeRango: 'La meta semanal debe estar en el rango válido (1 - 7).',
    colorNoSeleccionado: 'Selecciona un color antes de continuar.',
};

const HEX_COLOR = /^#([0-9a-f]{6})$/i;

/**
 * Valida los datos del formulario de un hábito.
 * @param {object} datos { nombre, descripcion, metaSemanal, color }
 * @param {Array} habitosExistentes lista actual para evitar nombres repetidos
 * @returns {{ valido: boolean, errores: Record<string,string> }}
 */
export function validarHabito(datos = {}, habitosExistentes = []) {
    const errores = {};
    const nombre = String(datos.nombre ?? '').trim();
    const descripcion = String(datos.descripcion ?? '').trim();
    const metaTexto = String(datos.metaSemanal ?? '').trim();
    const meta = Number(metaTexto);
    const color = String(datos.color ?? '').trim();

    if (!nombre) {
        errores.nombre = MENSAJES.nombreVacio; // HU-01 Escenario 2
    } else if (nombre.length < NOMBRE_MIN || nombre.length > NOMBRE_MAX) {
        errores.nombre = `El nombre debe tener entre ${NOMBRE_MIN} y ${NOMBRE_MAX} caracteres.`;
    } else if (
        habitosExistentes.some(
            (h) => h.activo !== false && h.nombre.toLowerCase() === nombre.toLowerCase()
        )
    ) {
        errores.nombre = 'Ya existe un hábito activo con ese nombre.';
    }

    if (descripcion.length > DESCRIPCION_MAX) {
        errores.descripcion = `La descripción no puede superar ${DESCRIPCION_MAX} caracteres.`;
    }

    // HU-01 Escenario 3: meta semanal fuera de rango (1 - 7)
    if (!metaTexto || !Number.isInteger(meta) || meta < META_MIN || meta > META_MAX) {
        errores.metaSemanal = MENSAJES.metaFueraDeRango;
    }

    // HU-01 Escenario 4: color no seleccionado
    if (!color) {
        errores.color = MENSAJES.colorNoSeleccionado;
    } else if (!HEX_COLOR.test(color)) {
        errores.color = 'El color debe tener formato hexadecimal (#RRGGBB).';
    }

    return { valido: Object.keys(errores).length === 0, errores };
}

function generarId() {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `h_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Crea el objeto hábito normalizado. Lanza error si los datos no son válidos.
 * Incluye campos que usarán los otros grupos (activo, cumplimientos).
 */
export function crearHabito(datos, habitosExistentes = [], ahora = new Date()) {
    const { valido, errores } = validarHabito(datos, habitosExistentes);
    if (!valido) {
        const error = new Error('Datos de hábito inválidos');
        error.errores = errores;
        throw error;
    }
    return {
        id: generarId(),
        nombre: String(datos.nombre).trim(),
        descripcion: String(datos.descripcion ?? '').trim(),
        metaSemanal: Number(datos.metaSemanal),
        color: String(datos.color).trim().toLowerCase(),
        activo: true,
        fechaCreacion: ahora.toISOString(),
        cumplimientos: [], // fechas 'YYYY-MM-DD' (Grupo 3)
    };
}
