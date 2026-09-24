import { describe, it, expect, beforeEach } from 'vitest';
import { agregarHabito, obtenerHabitos, CLAVE_STORAGE } from '../public/js/habitStorage.js';

beforeEach(() => localStorage.clear());

const datos = { nombre: 'Tomar agua', descripcion: '', metaSemanal: '7', color: '#00aaff' };

describe('habitStorage', () => {
    it('devuelve lista vacía si no hay datos', () => {
        expect(obtenerHabitos()).toEqual([]);
    });

    it('devuelve lista vacía si los datos están corruptos', () => {
        localStorage.setItem(CLAVE_STORAGE, '{no es json');
        expect(obtenerHabitos()).toEqual([]);
    });

    it('guarda el hábito en localStorage', () => {
        const h = agregarHabito(datos);
        const guardado = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
        expect(guardado).toHaveLength(1);
        expect(guardado[0].id).toBe(h.id);
    });

    it('persiste varios hábitos', () => {
        agregarHabito(datos);
        agregarHabito({ ...datos, nombre: 'Meditar' });
        expect(obtenerHabitos().map((h) => h.nombre)).toEqual(['Tomar agua', 'Meditar']);
    });

    it('no guarda nada si el hábito es inválido', () => {
        expect(() => agregarHabito({ ...datos, metaSemanal: '0' })).toThrow();
        expect(obtenerHabitos()).toEqual([]);
    });

    it('no permite duplicados', () => {
        agregarHabito(datos);
        expect(() => agregarHabito(datos)).toThrow();
        expect(obtenerHabitos()).toHaveLength(1);
    });
});
