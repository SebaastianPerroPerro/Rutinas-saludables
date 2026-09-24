import {
    CLAVE_STORAGE,
    calcularResumenSemanal,
    formatYMD,
    getWeekRange,
} from './summaryModel.js';

let fechaActualReferencia = new Date();

function obtenerHabitosLocalStorage() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_STORAGE) ?? '[]');
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

function guardarHabitosLocalStorage(habitos) {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(habitos));
}

function formatearRangoSemana(inicioStr, finStr) {
    const meses = [
        'ene', 'feb', 'mar', 'abr', 'may', 'jun',
        'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];
    const [, m1, d1] = inicioStr.split('-');
    const [, m2, d2] = finStr.split('-');

    const mes1 = meses[Number(m1) - 1];
    const mes2 = meses[Number(m2) - 1];

    if (mes1 === mes2) {
        return `${Number(d1)} - ${Number(d2)} de ${mes1}`;
    }
    return `${Number(d1)} ${mes1} - ${Number(d2)} ${mes2}`;
}

export function renderizarResumen() {
    const habitos = obtenerHabitosLocalStorage();
    const resumen = calcularResumenSemanal(habitos, fechaActualReferencia);

    // Texto de la semana
    const textoSemana = document.getElementById('texto-semana');
    if (textoSemana) {
        textoSemana.textContent = formatearRangoSemana(resumen.semana.inicio, resumen.semana.fin);
    }

    // Métricas
    const elTotalCumplimientos = document.getElementById('metric-total-cumplimientos');
    const elMetasAlcanzadas = document.getElementById('metric-metas-alcanzadas');
    const elCumplimientoGlobal = document.getElementById('metric-cumplimiento-global');
    const elBarraGlobal = document.getElementById('barra-global-progreso');
    const elTextoGlobal = document.getElementById('texto-global-progreso');

    if (elTotalCumplimientos) elTotalCumplimientos.textContent = resumen.totalCumplimientosSemana;
    if (elMetasAlcanzadas) {
        elMetasAlcanzadas.textContent = `${resumen.totalMetasAlcanzadas} / ${resumen.totalHabitosActivos}`;
    }
    if (elCumplimientoGlobal) {
        elCumplimientoGlobal.textContent = `${resumen.porcentajeCumplimientoGlobal}%`;
    }
    if (elBarraGlobal) {
        elBarraGlobal.style.width = `${resumen.porcentajeCumplimientoGlobal}%`;
    }
    if (elTextoGlobal) {
        elTextoGlobal.textContent = `${resumen.porcentajeCumplimientoGlobal}% de metas semanales`;
    }

    // Listas
    renderizarListaAlcanzados(resumen.habitosAlcanzados);
    renderizarListaPendientes(resumen.habitosPendientes);
}

function renderizarListaAlcanzados(habitos) {
    const contenedor = document.getElementById('lista-alcanzados');
    if (!contenedor) return;

    if (habitos.length === 0) {
        contenedor.innerHTML = '<li class="vacio">Aún no hay metas alcanzadas esta semana. ¡Sigue adelante!</li>';
        return;
    }

    contenedor.innerHTML = habitos
        .map(
            (h) => `
        <li class="habito-card" style="border-left-color: ${h.color};">
            <div class="habito-top">
                <span class="habito-titulo">${escapeHtml(h.nombre)}</span>
                <span class="badge badge-exito">✓ Meta alcanzada</span>
            </div>
            ${h.descripcion ? `<p class="habito-descripcion">${escapeHtml(h.descripcion)}</p>` : ''}
            <div class="habito-progreso-barra">
                <div class="habito-progreso-relleno" style="width: 100%; background: ${h.color};"></div>
            </div>
            <div class="habito-footer">
                <span>Completado: <strong>${h.cumplimientosSemana}</strong> de ${h.metaSemanal} veces</span>
                <span>${h.porcentaje}%</span>
            </div>
        </li>
    `
        )
        .join('');
}

function renderizarListaPendientes(habitos) {
    const contenedor = document.getElementById('lista-pendientes');
    if (!contenedor) return;

    if (habitos.length === 0) {
        contenedor.innerHTML = '<li class="vacio">¡Excelente! No tienes hábitos pendientes para esta semana.</li>';
        return;
    }

    contenedor.innerHTML = habitos
        .map(
            (h) => `
        <li class="habito-card" style="border-left-color: ${h.color};">
            <div class="habito-top">
                <span class="habito-titulo">${escapeHtml(h.nombre)}</span>
                <span class="badge badge-pendiente">Faltan ${h.faltantesParaMeta} ${h.faltantesParaMeta === 1 ? 'día' : 'días'}</span>
            </div>
            ${h.descripcion ? `<p class="habito-descripcion">${escapeHtml(h.descripcion)}</p>` : ''}
            <div class="habito-progreso-barra">
                <div class="habito-progreso-relleno" style="width: ${h.porcentaje}%; background: ${h.color};"></div>
            </div>
            <div class="habito-footer">
                <span>Progreso: <strong>${h.cumplimientosSemana}</strong> de ${h.metaSemanal}</span>
                <span>${h.porcentaje}%</span>
            </div>
        </li>
    `
        )
        .join('');
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// Navegación de semanas
function cambiarSemana(diasOffset) {
    const nuevaFecha = new Date(fechaActualReferencia);
    nuevaFecha.setDate(nuevaFecha.getDate() + diasOffset);
    fechaActualReferencia = nuevaFecha;
    renderizarResumen();
}

function restablecerSemanaActual() {
    fechaActualReferencia = new Date();
    renderizarResumen();
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarResumen();

    document.getElementById('btn-semana-anterior')?.addEventListener('click', () => cambiarSemana(-7));
    document.getElementById('btn-semana-siguiente')?.addEventListener('click', () => cambiarSemana(7));
    document.getElementById('btn-semana-hoy')?.addEventListener('click', restablecerSemanaActual);
});
