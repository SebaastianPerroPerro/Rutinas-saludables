// @ts-nocheck -- importa los módulos JavaScript del navegador (Grupo 1 y Grupo 2), que no tienen tipos.
// Pruebas del Grupo 2 — listado y gestión de hábitos.
import { describe, it, expect, beforeEach } from 'vitest';
import { agregarHabito, obtenerHabitos, CLAVE_STORAGE } from '../../src/grupo1/habitos-grupo1/public/js/habitStorage.js';
import {
    listarHabitos,
    obtenerHabitoPorId,
    editarHabito,
    desactivarHabito,
    reactivarHabito,
    eliminarHabito,
    completadoHoy,
    fechaISO,
    MENSAJES_GESTION,
} from '../../src/grupo2/public/js/gestionHabitos.js';

/** localStorage en memoria para poder probar sin navegador. */
function crearStorage() {
    const datos = new Map();
    return {
        getItem: (clave) => (datos.has(clave) ? datos.get(clave) : null),
        setItem: (clave, valor) => datos.set(clave, String(valor)),
        clear: () => datos.clear(),
    };
}

let storage;
const nuevo = (nombre, extra = {}) =>
    agregarHabito({ nombre, descripcion: '', metaSemanal: '3', color: '#22c55e', ...extra }, storage);

beforeEach(() => {
    storage = crearStorage();
});

describe('listarHabitos', () => {
    it('devuelve una lista vacía cuando no hay hábitos (estado vacío)', () => {
        expect(listarHabitos(storage)).toEqual([]);
    });

    it('devuelve lista vacía si los datos guardados están corruptos', () => {
        storage.setItem(CLAVE_STORAGE, '{no es json');
        expect(listarHabitos(storage)).toEqual([]);
    });

    it('lista los hábitos ordenados por nombre sin importar mayúsculas', () => {
        nuevo('meditar');
        nuevo('Agua');
        nuevo('Ejercicio');
        expect(listarHabitos(storage).map((h) => h.nombre)).toEqual(['Agua', 'Ejercicio', 'meditar']);
    });

    it('por defecto oculta los hábitos desactivados', () => {
        const leer = nuevo('Leer');
        nuevo('Correr');
        desactivarHabito(leer.id, storage);
        expect(listarHabitos(storage).map((h) => h.nombre)).toEqual(['Correr']);
    });

    it('muestra también los desactivados cuando se pide', () => {
        const leer = nuevo('Leer');
        nuevo('Correr');
        desactivarHabito(leer.id, storage);
        expect(listarHabitos(storage, { incluirInactivos: true })).toHaveLength(2);
    });
});

describe('obtenerHabitoPorId', () => {
    it('encuentra un hábito por su id', () => {
        const habito = nuevo('Leer');
        expect(obtenerHabitoPorId(habito.id, storage).nombre).toBe('Leer');
    });

    it('devuelve null si no existe', () => {
        expect(obtenerHabitoPorId('no-existe', storage)).toBeNull();
    });
});

describe('editarHabito', () => {
    it('actualiza los datos y conserva id, estado, fecha y cumplimientos', () => {
        const habito = nuevo('Leer');
        const guardados = obtenerHabitos(storage);
        guardados[0].cumplimientos = ['2026-09-20'];
        storage.setItem(CLAVE_STORAGE, JSON.stringify(guardados));

        const resultado = editarHabito(
            habito.id,
            { nombre: '  Leer 30 min ', descripcion: 'Antes de dormir', metaSemanal: '6', color: '#3B82F6' },
            storage
        );

        expect(resultado).toEqual({
            ...habito,
            nombre: 'Leer 30 min',
            descripcion: 'Antes de dormir',
            metaSemanal: 6,
            color: '#3b82f6',
            cumplimientos: ['2026-09-20'],
        });
        expect(obtenerHabitoPorId(habito.id, storage)).toEqual(resultado);
    });

    it('permite guardar el mismo nombre del hábito que se está editando', () => {
        const habito = nuevo('Leer');
        expect(() =>
            editarHabito(habito.id, { nombre: 'LEER', metaSemanal: '2', color: '#22c55e' }, storage)
        ).not.toThrow();
    });

    it('rechaza un nombre que ya usa otro hábito activo', () => {
        nuevo('Correr');
        const leer = nuevo('Leer');
        expect(() =>
            editarHabito(leer.id, { nombre: 'correr', metaSemanal: '3', color: '#22c55e' }, storage)
        ).toThrow();
        expect(obtenerHabitoPorId(leer.id, storage).nombre).toBe('Leer');
    });

    it('aplica las mismas validaciones del Grupo 1 y no guarda si hay errores', () => {
        const habito = nuevo('Leer');
        try {
            editarHabito(habito.id, { nombre: '', metaSemanal: '9', color: '' }, storage);
            expect.unreachable();
        } catch (error) {
            expect(Object.keys(error.errores).sort()).toEqual(['color', 'metaSemanal', 'nombre']);
        }
        expect(obtenerHabitoPorId(habito.id, storage)).toEqual(habito);
    });

    it('falla si el hábito no existe', () => {
        expect(() =>
            editarHabito('no-existe', { nombre: 'Leer', metaSemanal: '3', color: '#22c55e' }, storage)
        ).toThrow(MENSAJES_GESTION.noEncontrado);
    });
});

describe('desactivar y reactivar', () => {
    it('desactivar conserva el hábito guardado con activo = false', () => {
        const habito = nuevo('Leer');
        desactivarHabito(habito.id, storage);
        expect(obtenerHabitoPorId(habito.id, storage).activo).toBe(false);
        expect(obtenerHabitos(storage)).toHaveLength(1);
    });

    it('reactivar vuelve a mostrar el hábito en el listado', () => {
        const habito = nuevo('Leer');
        desactivarHabito(habito.id, storage);
        reactivarHabito(habito.id, storage);
        expect(listarHabitos(storage).map((h) => h.id)).toEqual([habito.id]);
    });

    it('no permite reactivar si ya hay otro hábito activo con el mismo nombre', () => {
        const viejo = nuevo('Leer');
        desactivarHabito(viejo.id, storage);
        nuevo('Leer'); // el Grupo 1 permite repetir el nombre de un hábito inactivo

        expect(() => reactivarHabito(viejo.id, storage)).toThrow();
        expect(obtenerHabitoPorId(viejo.id, storage).activo).toBe(false);
    });

    it('falla si el hábito no existe', () => {
        expect(() => desactivarHabito('no-existe', storage)).toThrow(MENSAJES_GESTION.noEncontrado);
    });
});

describe('eliminarHabito', () => {
    it('borra el hábito del almacenamiento y deja los demás', () => {
        const leer = nuevo('Leer');
        const correr = nuevo('Correr');
        const resultado = eliminarHabito(leer.id, storage);

        expect(resultado.id).toBe(leer.id);
        expect(obtenerHabitos(storage).map((h) => h.id)).toEqual([correr.id]);
    });

    it('falla si el hábito no existe', () => {
        expect(() => eliminarHabito('no-existe', storage)).toThrow(MENSAJES_GESTION.noEncontrado);
    });
});

describe('persistencia (demo del Grupo 2)', () => {
    it('crear, editar, desactivar y volver a consultar conserva los cambios', () => {
        const agua = nuevo('Tomar agua', { metaSemanal: '7' });
        const leer = nuevo('Leer');
        editarHabito(agua.id, { nombre: 'Tomar 2L de agua', metaSemanal: '7', color: '#3b82f6' }, storage);
        desactivarHabito(leer.id, storage);

        // Se vuelve a leer desde el almacenamiento, como si se recargara la página
        const copia = crearStorage();
        copia.setItem(CLAVE_STORAGE, storage.getItem(CLAVE_STORAGE));

        expect(listarHabitos(copia).map((h) => h.nombre)).toEqual(['Tomar 2L de agua']);
        expect(obtenerHabitoPorId(leer.id, copia).activo).toBe(false);
    });
});

describe('fechaISO y completadoHoy', () => {
    it('formatea la fecha local como YYYY-MM-DD', () => {
        expect(fechaISO(new Date(2026, 0, 5))).toBe('2026-01-05');
    });

    it('indica si el hábito se completó hoy', () => {
        const hoy = '2026-09-24';
        expect(completadoHoy({ cumplimientos: ['2026-09-23', hoy] }, hoy)).toBe(true);
        expect(completadoHoy({ cumplimientos: ['2026-09-23'] }, hoy)).toBe(false);
        expect(completadoHoy({}, hoy)).toBe(false);
    });
});
