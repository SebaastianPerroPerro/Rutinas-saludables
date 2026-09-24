// Controlador de la pantalla "Nuevo hábito" (HU-01).
import { agregarHabito, obtenerHabitos } from './habitStorage.js';
import { COLORES } from './habitModel.js';

export function iniciarApp(doc = document, storage = globalThis.localStorage) {
    const form = doc.getElementById('form-habito');
    const mensaje = doc.getElementById('mensaje');
    const lista = doc.getElementById('lista-habitos');
    const paleta = doc.getElementById('paleta');
    const campos = ['nombre', 'descripcion', 'metaSemanal', 'color'];

    // Paleta de colores SIN selección inicial (HU-01 Escenario 4)
    paleta.innerHTML = '';
    COLORES.forEach((hex, i) => {
        const label = doc.createElement('label');
        label.className = 'swatch';
        label.title = hex;
        label.innerHTML = `<input type="radio" name="color" id="color-${i}" /><span></span>`;
        label.querySelector('input').value = hex;
        label.querySelector('span').style.background = hex;
        paleta.appendChild(label);
    });

    const elementoCampo = (c) =>
        c === 'color' ? doc.getElementById('campo-color') : form.elements[c];

    function limpiarErrores() {
        campos.forEach((c) => {
            doc.getElementById(`error-${c}`).textContent = '';
            elementoCampo(c).removeAttribute('aria-invalid');
        });
        mensaje.textContent = '';
        mensaje.className = 'mensaje';
    }

    function leerFormulario() {
        const seleccionado = form.querySelector('input[name="color"]:checked');
        return {
            nombre: form.elements.nombre.value,
            descripcion: form.elements.descripcion.value,
            metaSemanal: form.elements.metaSemanal.value,
            color: seleccionado ? seleccionado.value : '',
        };
    }

    function pintarLista() {
        const habitos = obtenerHabitos(storage).filter((h) => h.activo);
        lista.innerHTML = '';
        if (habitos.length === 0) {
            lista.innerHTML = '<li class="vacio">Aún no tienes hábitos creados.</li>';
            return;
        }
        habitos.forEach((h) => {
            const li = doc.createElement('li');
            li.className = 'habito';
            li.style.borderLeftColor = h.color;
            li.innerHTML = `<strong></strong><span class="meta"></span><p></p>`;
            li.querySelector('strong').textContent = h.nombre;
            li.querySelector('.meta').textContent = `Meta: ${h.metaSemanal} ${h.metaSemanal === 1 ? 'vez' : 'veces'} por semana`;
            li.querySelector('p').textContent = h.descripcion;
            lista.appendChild(li);
        });
    }

    // Evento de todos los escenarios: el usuario presiona "Guardar"
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        limpiarErrores();
        try {
            const habito = agregarHabito(leerFormulario(), storage); // Escenario 1
            mensaje.textContent = `Hábito "${habito.nombre}" guardado correctamente.`;
            mensaje.classList.add('exito');
            form.reset();
            pintarLista();
        } catch (err) {
            if (!err.errores) throw err;
            // Escenarios 2, 3 y 4: mostrar error y NO guardar
            Object.entries(err.errores).forEach(([campo, texto]) => {
                doc.getElementById(`error-${campo}`).textContent = texto;
                elementoCampo(campo).setAttribute('aria-invalid', 'true');
            });
            mensaje.textContent = 'No se guardó el hábito. Revisa los campos marcados.';
            mensaje.classList.add('error');
        }
    });

    pintarLista();
}

if (typeof window !== 'undefined' && !window.__TEST__) {
    window.addEventListener('DOMContentLoaded', () => iniciarApp());
}
