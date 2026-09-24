// Pruebas de aceptación de la HU-01 — un bloque por escenario de la plantilla.
// HU-01: Como usuario, deseo crear un hábito con nombre, descripción, meta semanal
// y color, con la finalidad de darle seguimiento de forma personalizada.
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { iniciarApp } from '../public/js/app.js';
import { obtenerHabitos } from '../public/js/habitStorage.js';
import { MENSAJES } from '../public/js/habitModel.js';

const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');
const body = html.match(/<body>([\s\S]*)<\/body>/)[1];
const $ = (id) => document.getElementById(id);

function llenar({ nombre = '', descripcion = '', metaSemanal = '', colorIndex = null }) {
    $('nombre').value = nombre;
    $('descripcion').value = descripcion;
    $('metaSemanal').value = metaSemanal;
    if (colorIndex !== null) $(`color-${colorIndex}`).checked = true;
}
const presionarGuardar = () =>
    $('form-habito').dispatchEvent(new Event('submit', { cancelable: true }));

beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = body;
    iniciarApp(document, localStorage);
});

describe('HU-01 — Contexto: pantalla "Nuevo hábito"', () => {
    it('existe la pantalla "Nuevo hábito" con el botón "Guardar"', () => {
        expect($('pantalla-nuevo-habito').querySelector('h2').textContent).toBe('Nuevo hábito');
        expect($('btn-guardar').textContent).toBe('Guardar');
    });

    it('ningún color viene seleccionado por defecto', () => {
        expect(document.querySelector('input[name="color"]:checked')).toBeNull();
    });
});

describe('HU-01 Escenario 1 — Creación exitosa', () => {
    it('guarda el hábito localmente y lo muestra en la vista', () => {
        llenar({ nombre: 'Leer', descripcion: '20 minutos', metaSemanal: '5', colorIndex: 3 });
        presionarGuardar();

        const guardados = JSON.parse(localStorage.getItem('habitos'));
        expect(guardados).toHaveLength(1);
        expect(guardados[0]).toMatchObject({
            nombre: 'Leer',
            descripcion: '20 minutos',
            metaSemanal: 5,
            color: '#22c55e',
            activo: true,
        });
        expect($('lista-habitos').textContent).toContain('Leer');
        expect($('mensaje').textContent).toMatch(/guardado correctamente/);
        expect($('nombre').value).toBe('');
    });
});

describe('HU-01 Escenario 2 — Nombre vacío', () => {
    it.each(['', '    '])('muestra mensaje de error y no guarda (nombre="%s")', (nombre) => {
        llenar({ nombre, metaSemanal: '3', colorIndex: 0 });
        presionarGuardar();

        expect($('error-nombre').textContent).toBe(MENSAJES.nombreVacio);
        expect($('nombre').getAttribute('aria-invalid')).toBe('true');
        expect(obtenerHabitos()).toHaveLength(0);
    });
});

describe('HU-01 Escenario 3 — Meta semanal fuera de rango', () => {
    it.each(['0', '-2', '8', '15', '2.5', ''])(
        'muestra error indicando el rango válido (1 - 7) y no guarda (meta=%s)',
        (metaSemanal) => {
            llenar({ nombre: 'Correr', metaSemanal, colorIndex: 1 });
            presionarGuardar();

            expect($('error-metaSemanal').textContent).toBe(MENSAJES.metaFueraDeRango);
            expect($('error-metaSemanal').textContent).toContain('1 - 7');
            expect(obtenerHabitos()).toHaveLength(0);
        }
    );

    it.each(['1', '7'])('acepta los límites del rango (meta=%s)', (metaSemanal) => {
        llenar({ nombre: 'Correr', metaSemanal, colorIndex: 1 });
        presionarGuardar();
        expect(obtenerHabitos()).toHaveLength(1);
    });
});

describe('HU-01 Escenario 4 — Color no seleccionado', () => {
    it('solicita seleccionar un color antes de continuar y no guarda', () => {
        llenar({ nombre: 'Meditar', metaSemanal: '7' });
        presionarGuardar();

        expect($('error-color').textContent).toBe(MENSAJES.colorNoSeleccionado);
        expect($('campo-color').getAttribute('aria-invalid')).toBe('true');
        expect(obtenerHabitos()).toHaveLength(0);
    });

    it('al seleccionar el color y volver a guardar, el hábito se crea', () => {
        llenar({ nombre: 'Meditar', metaSemanal: '7' });
        presionarGuardar();
        $('color-5').checked = true;
        presionarGuardar();

        expect($('error-color').textContent).toBe('');
        expect(obtenerHabitos()).toHaveLength(1);
    });
});

describe('HU-01 — Validaciones adicionales', () => {
    it('no permite nombres duplicados', () => {
        llenar({ nombre: 'Leer', metaSemanal: '3', colorIndex: 0 });
        presionarGuardar();
        llenar({ nombre: 'LEER', metaSemanal: '3', colorIndex: 0 });
        presionarGuardar();
        expect(obtenerHabitos()).toHaveLength(1);
        expect($('error-nombre').textContent).toMatch(/Ya existe/);
    });

    it('no interpreta HTML en el nombre (evita XSS)', () => {
        llenar({ nombre: '<img src=x onerror=alert(1)>', metaSemanal: '2', colorIndex: 0 });
        presionarGuardar();
        expect(document.querySelector('#lista-habitos img')).toBeNull();
    });
});
