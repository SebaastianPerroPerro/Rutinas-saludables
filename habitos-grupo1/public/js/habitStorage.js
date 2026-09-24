// Persistencia en localStorage (compartida con los demás grupos).
import { crearHabito } from './habitModel.js';

export const CLAVE_STORAGE = 'habitos';

export function obtenerHabitos(storage = globalThis.localStorage) {
    try {
        const datos = JSON.parse(storage.getItem(CLAVE_STORAGE) ?? '[]');
        return Array.isArray(datos) ? datos : [];
    } catch {
        return []; // datos corruptos: se arranca vacío
    }
}

export function guardarHabitos(habitos, storage = globalThis.localStorage) {
    storage.setItem(CLAVE_STORAGE, JSON.stringify(habitos));
}

/** Valida, crea y persiste un hábito. Devuelve el hábito creado. */
export function agregarHabito(datos, storage = globalThis.localStorage) {
    const habitos = obtenerHabitos(storage);
    const nuevo = crearHabito(datos, habitos);
    guardarHabitos([...habitos, nuevo], storage);
    return nuevo;
}
