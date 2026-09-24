// Lógica pura de resumen semanal para el navegador (Frontend)
export const CLAVE_STORAGE = 'habitos';

export function formatYMD(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function parseDateInput(value) {
    if (value instanceof Date) {
        return new Date(value.getTime());
    }
    const str = String(value).trim();
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(str);
    if (match) {
        return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function getWeekRange(referenceDate = new Date()) {
    const ref = parseDateInput(referenceDate);
    const day = ref.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;

    const monday = new Date(ref);
    monday.setDate(ref.getDate() + diffToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
        inicio: formatYMD(monday),
        fin: formatYMD(sunday),
        mondayDate: monday,
        sundayDate: sunday,
    };
}

export function calcularResumenSemanal(habitos = [], referenceDate = new Date()) {
    const weekRange = getWeekRange(referenceDate);
    const { inicio, fin } = weekRange;

    const habitosActivos = (habitos || []).filter((h) => h.activo !== false);

    const progresos = habitosActivos.map((habit) => {
        const uniqueDays = new Set();
        const cumplimientos = Array.isArray(habit.cumplimientos) ? habit.cumplimientos : [];

        for (const item of cumplimientos) {
            const strDate = String(item).split('T')[0];
            if (strDate >= inicio && strDate <= fin) {
                uniqueDays.add(strDate);
            }
        }

        const diasCompletados = Array.from(uniqueDays).sort();
        const cumplimientosSemana = diasCompletados.length;
        const meta = habit.metaSemanal > 0 ? habit.metaSemanal : 1;
        const porcentaje = Math.min(100, Math.round((cumplimientosSemana / meta) * 100));
        const alcanzado = cumplimientosSemana >= meta;
        const faltantesParaMeta = Math.max(0, meta - cumplimientosSemana);

        return {
            id: habit.id,
            nombre: habit.nombre,
            descripcion: habit.descripcion ?? '',
            metaSemanal: habit.metaSemanal,
            color: habit.color || '#4f46e5',
            cumplimientosSemana,
            porcentaje,
            alcanzado,
            faltantesParaMeta,
            diasCompletados,
        };
    });

    const habitosAlcanzados = progresos.filter((p) => p.alcanzado);
    const habitosPendientes = progresos.filter((p) => !p.alcanzado);

    const totalCumplimientosSemana = progresos.reduce((acc, p) => acc + p.cumplimientosSemana, 0);
    const totalMetas = progresos.reduce((acc, p) => acc + p.metaSemanal, 0);
    const porcentajeCumplimientoGlobal =
        totalMetas > 0 ? Math.min(100, Math.round((totalCumplimientosSemana / totalMetas) * 100)) : 0;

    return {
        semana: { inicio, fin },
        totalHabitosActivos: habitosActivos.length,
        totalCumplimientosSemana,
        totalMetasAlcanzadas: habitosAlcanzados.length,
        totalMetasPendientes: habitosPendientes.length,
        porcentajeCumplimientoGlobal,
        habitosAlcanzados,
        habitosPendientes,
    };
}
