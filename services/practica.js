import { prisma } from "../lib/prisma";

export const LIMITE_DIARIO = 100;

export function fechaHoy() {
    const texto = new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Bogota",
    });
    return new Date(texto + "T00:00:00.000Z");
}

function inicioDeHoy() {
    return new Date(fechaHoy().getTime() + 5 * 60 * 60 * 1000);
}

function filtroPasadas(areaId) {
    const hoy = fechaHoy();
    return {
        ...(areaId ? { areaId } : {}),
        AND: [
            { delDia: { some: { fecha: { lt: hoy } } } },
            { delDia: { none: { fecha: { gte: hoy } } } },
        ],
    };
}

export async function poolTotal(areaId = null) {
    return prisma.pregunta.findMany({
        where: filtroPasadas(areaId),
        select: { id: true, areaId: true },
    });
}

export async function poolPractica(usuarioId, areaId = null, sesion = null) {
    const filtro = filtroPasadas(areaId);
    if (!sesion) {
        return prisma.pregunta.findMany({
            where: filtro,
            select: { id: true, areaId: true },
        });
    }
    return prisma.pregunta.findMany({
        where: {
            ...filtro,
            practicas: { none: { usuarioId, sesion } },
        },
        select: { id: true, areaId: true },
    });
}

export async function resumenHoy(usuarioId) {
    const inicio = inicioDeHoy();
    const [total, aciertos] = await Promise.all([
        prisma.respuestaPractica.count({
            where: { usuarioId, fecha: { gte: inicio } },
        }),
        prisma.respuestaPractica.count({
            where: { usuarioId, acierto: true, fecha: { gte: inicio } },
        }),
    ]);
    return { total, aciertos, llegoAlLimite: total >= LIMITE_DIARIO };
}

export async function siguientePreguntaId(
    usuarioId,
    areaId = null,
    sesion = null,
    excluirId = null
) {
    const pool = await poolPractica(usuarioId, areaId, sesion);
    const ids = pool.map((p) => p.id).filter((id) => id !== excluirId);
    if (ids.length === 0) return null;

    const [diarias, practicas] = await Promise.all([
        prisma.respuesta.findMany({
            where: { usuarioId, preguntaId: { in: ids } },
            select: { preguntaId: true, acierto: true, fecha: true },
        }),
        prisma.respuestaPractica.findMany({
            where: { usuarioId, preguntaId: { in: ids } },
            select: { preguntaId: true, acierto: true, fecha: true },
        }),
    ]);

    const ultimo = new Map();
    for (const r of [...diarias, ...practicas]) {
        const actual = ultimo.get(r.preguntaId);
        if (!actual || r.fecha > actual.fecha) ultimo.set(r.preguntaId, r);
    }

    const prioridad = (id) => {
        const u = ultimo.get(id);
        return !u ? 0 : u.acierto ? 2 : 1;
    };
    const mejor = Math.min(...ids.map(prioridad));
    const grupo = ids.filter((id) => prioridad(id) === mejor);
    return grupo[Math.floor(Math.random() * grupo.length)];
}