import { describe, it, expect } from 'vitest';
import { validarHabito, crearHabito, MENSAJES } from '../public/js/habitModel.js';

const base = { nombre: 'Leer', descripcion: '20 min', metaSemanal: '5', color: '#ff0000' };

describe('validarHabito', () => {
    it('acepta datos válidos', () => {
        expect(validarHabito(base).valido).toBe(true);
    });

    it('exige nombre', () => {
        const r = validarHabito({ ...base, nombre: '   ' });
        expect(r.valido).toBe(false);
        expect(r.errores.nombre).toMatch(/obligatorio/);
    });

    it('rechaza nombre muy corto o muy largo', () => {
        expect(validarHabito({ ...base, nombre: 'ab' }).errores.nombre).toBeDefined();
        expect(validarHabito({ ...base, nombre: 'a'.repeat(51) }).errores.nombre).toBeDefined();
    });

    it('rechaza nombres duplicados sin importar mayúsculas', () => {
        const r = validarHabito({ ...base, nombre: 'LEER' }, [{ nombre: 'leer', activo: true }]);
        expect(r.errores.nombre).toMatch(/Ya existe/);
    });

    it('permite repetir nombre de un hábito inactivo', () => {
        expect(validarHabito(base, [{ nombre: 'Leer', activo: false }]).valido).toBe(true);
    });

    it('la descripción es opcional pero con máximo 200 caracteres', () => {
        expect(validarHabito({ ...base, descripcion: '' }).valido).toBe(true);
        expect(validarHabito({ ...base, descripcion: 'x'.repeat(201) }).errores.descripcion).toBeDefined();
    });

    it.each(['', '0', '8', '2.5', 'abc', '-1'])('rechaza meta semanal inválida: "%s"', (meta) => {
        expect(validarHabito({ ...base, metaSemanal: meta }).errores.metaSemanal).toBeDefined();
    });

    it.each(['1', '7', 4])('acepta meta semanal válida: %s', (meta) => {
        expect(validarHabito({ ...base, metaSemanal: meta }).valido).toBe(true);
    });

    it('exige color (HU-01 Escenario 4)', () => {
        expect(validarHabito({ ...base, color: '' }).errores.color).toBe(MENSAJES.colorNoSeleccionado);
    });

    it('rechaza color con formato inválido', () => {
        expect(validarHabito({ ...base, color: 'rojo' }).errores.color).toBeDefined();
    });
});

describe('crearHabito', () => {
    it('crea un hábito normalizado', () => {
        const fecha = new Date('2026-09-23T10:00:00Z');
        const h = crearHabito({ ...base, nombre: '  Leer  ', color: '#FF0000' }, [], fecha);
        expect(h).toMatchObject({
            nombre: 'Leer',
            descripcion: '20 min',
            metaSemanal: 5,
            color: '#ff0000',
            activo: true,
            fechaCreacion: '2026-09-23T10:00:00.000Z',
            cumplimientos: [],
        });
        expect(h.id).toBeTruthy();
    });

    it('genera ids distintos', () => {
        const a = crearHabito(base);
        const b = crearHabito({ ...base, nombre: 'Correr' });
        expect(a.id).not.toBe(b.id);
    });

    it('lanza error con el detalle de campos inválidos', () => {
        try {
            crearHabito({ nombre: '', metaSemanal: '9' });
            expect.unreachable();
        } catch (e) {
            expect(e.errores).toHaveProperty('nombre');
            expect(e.errores).toHaveProperty('metaSemanal');
        }
    });
});
