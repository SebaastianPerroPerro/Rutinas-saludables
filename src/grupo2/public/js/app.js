// Controlador de la pantalla de listado y gestión (Grupo 2).
import { COLORES } from '../../../grupo1/habitos-grupo1/public/js/habitModel.js';
import {
    listarHabitos,
    obtenerHabitoPorId,
    editarHabito,
    desactivarHabito,
    reactivarHabito,
    eliminarHabito,
    completadoHoy,
    fechaISO,
} from './gestionHabitos.js';

export function iniciarGestion(doc = document, storage = globalThis.localStorage) {
    const lista = doc.getElementById('lista-gestion');
    const mensaje = doc.getElementById('mensaje-gestion');
    const filtroInactivos = doc.getElementById('mostrar-inactivos');
    const plantillaHabito = doc.getElementById('plantilla-habito');
    const plantillaEdicion = doc.getElementById('plantilla-edicion');
    let idEnEdicion = null;

    function mostrarMensaje(texto, tipo = 'exito') {
        mensaje.textContent = texto;
        mensaje.className = `mensaje ${tipo}`;
    }

    function crearFormularioEdicion(habito) {
        const form = plantillaEdicion.content.firstElementChild.cloneNode(true);
        form.elements.nombre.value = habito.nombre;
        form.elements.descripcion.value = habito.descripcion ?? '';
        form.elements.metaSemanal.value = habito.metaSemanal;

        const paleta = form.querySelector('.paleta');
        COLORES.forEach((hex) => {
            const label = doc.createElement('label');
            label.className = 'swatch';
            label.title = hex;
            label.innerHTML = '<input type="radio" name="color" /><span></span>';
            const radio = label.querySelector('input');
            radio.value = hex;
            radio.checked = hex === habito.color;
            label.querySelector('span').style.background = hex;
            paleta.appendChild(label);
        });

        form.addEventListener('submit', (evento) => {
            evento.preventDefault();
            form.querySelectorAll('[data-error]').forEach((el) => (el.textContent = ''));
            const seleccionado = form.querySelector('input[name="color"]:checked');
            try {
                const resultado = editarHabito(
                    habito.id,
                    {
                        nombre: form.elements.nombre.value,
                        descripcion: form.elements.descripcion.value,
                        metaSemanal: form.elements.metaSemanal.value,
                        color: seleccionado ? seleccionado.value : '',
                    },
                    storage
                );
                idEnEdicion = null;
                pintarLista();
                mostrarMensaje(`Hábito "${resultado.nombre}" actualizado.`);
            } catch (err) {
                if (!err.errores) throw err;
                Object.entries(err.errores).forEach(([campo, texto]) => {
                    const destino = form.querySelector(`[data-error="${campo}"]`);
                    if (destino) destino.textContent = texto;
                    else mostrarMensaje(texto, 'error');
                });
            }
        });

        // Escape cancela la edición sin guardar
        form.addEventListener('keydown', (teclado) => {
            if (teclado.key === 'Escape') cancelarEdicion();
        });

        return form;
    }

    function cancelarEdicion() {
        idEnEdicion = null;
        pintarLista();
    }

    function crearElementoHabito(habito, hoy) {
        const li = plantillaHabito.content.firstElementChild.cloneNode(true);
        li.dataset.id = habito.id;
        li.style.borderLeftColor = habito.color;
        li.classList.toggle('inactivo', habito.activo === false);

        li.querySelector('.nombre').textContent = habito.nombre;
        li.querySelector('.estado').textContent = habito.activo === false ? 'Desactivado' : '';
        li.querySelector('.meta').textContent =
            `Meta: ${habito.metaSemanal} ${habito.metaSemanal === 1 ? 'vez' : 'veces'} por semana`;
        li.querySelector('.descripcion').textContent = habito.descripcion ?? '';

        const hecho = completadoHoy(habito, hoy);
        const indicador = li.querySelector('.hoy');
        indicador.textContent = hecho ? 'Hoy: completado' : 'Hoy: pendiente';
        indicador.classList.toggle('hecho', hecho);

        li.querySelector('[data-opcion="desactivar"]').hidden = habito.activo === false;
        li.querySelector('[data-opcion="reactivar"]').hidden = habito.activo !== false;

        if (habito.id === idEnEdicion) {
            li.querySelector('.acciones').hidden = true;
            li.appendChild(crearFormularioEdicion(habito));
        }
        return li;
    }

    function pintarLista() {
        const habitos = listarHabitos(storage, { incluirInactivos: filtroInactivos.checked });
        const hoy = fechaISO();
        lista.innerHTML = '';

        if (habitos.length === 0) {
            const vacio = doc.createElement('li');
            vacio.className = 'vacio';
            vacio.id = 'estado-vacio';
            vacio.textContent = 'No tienes hábitos para mostrar. Crea uno nuevo para empezar.';
            lista.appendChild(vacio);
            return;
        }
        habitos.forEach((habito) => lista.appendChild(crearElementoHabito(habito, hoy)));

        const campoNombre = lista.querySelector('.form-edicion input[name="nombre"]');
        if (campoNombre) campoNombre.focus();
    }

    function ejecutarOpcion(opcion, id) {
        const habito = obtenerHabitoPorId(id, storage);
        if (!habito && opcion !== 'cancelar') {
            mostrarMensaje('El hábito no existe o ya fue eliminado.', 'error');
            pintarLista();
            return;
        }

        try {
            switch (opcion) {
                case 'editar':
                    idEnEdicion = id;
                    mostrarMensaje('', '');
                    break;
                case 'cancelar':
                    idEnEdicion = null;
                    break;
                case 'desactivar':
                    desactivarHabito(id, storage);
                    mostrarMensaje(`Hábito "${habito.nombre}" desactivado.`);
                    break;
                case 'reactivar':
                    reactivarHabito(id, storage);
                    mostrarMensaje(`Hábito "${habito.nombre}" reactivado.`);
                    break;
                case 'eliminar':
                    if (!confirm(`¿Eliminar "${habito.nombre}" y todo su historial? Esta acción no se puede deshacer.`)) {
                        return;
                    }
                    eliminarHabito(id, storage);
                    mostrarMensaje(`Hábito "${habito.nombre}" eliminado.`);
                    break;
                default:
                    return;
            }
        } catch (err) {
            if (!err.errores) throw err;
            mostrarMensaje(Object.values(err.errores).join(' '), 'error');
        }
        pintarLista();
    }

    lista.addEventListener('click', (evento) => {
        const boton = evento.target.closest('button[data-opcion]');
        if (!boton) return;
        const opcion = boton.dataset.opcion;
        ejecutarOpcion(opcion, boton.closest('li[data-id]').dataset.id);
    });

    filtroInactivos.addEventListener('change', pintarLista);

    // Si otra pestaña (por ejemplo la del Grupo 1) cambia los hábitos, refrescamos la lista
    globalThis.addEventListener?.('storage', pintarLista);

    pintarLista();
}

if (typeof window !== 'undefined' && !window.__TEST__) {
    window.addEventListener('DOMContentLoaded', () => iniciarGestion());
}
