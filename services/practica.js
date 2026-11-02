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

export async function poolPractica(areaId = null) {
    const hoy = fechaHoy();
    return prisma.pregunta.findMany({
        where: {
            ...(areaId ? { areaId } : {}),
            AND: [
                { delDia: { some: { fecha: { lt: hoy } } } },
                { delDia: { none: { fecha: { gte: hoy } } } },
            ],
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

export async function siguientePreguntaId(usuarioId, areaId = null) {
    const pool = await poolPractica(areaId);
    const ids = pool.map((p) => p.id);
    if (ids.length === 0) return null;

    const [diarias, practicas, ultima] = await Promise.all([
        prisma.respuesta.findMany({
            where: { usuarioId, preguntaId: { in: ids } },
            select: { preguntaId: true, acierto: true, fecha: true },
        }),
        prisma.respuestaPractica.findMany({
            where: { usuarioId, preguntaId: { in: ids } },
            select: { preguntaId: true, acierto: true, fecha: true },
        }),
        prisma.respuestaPractica.findFirst({
            where: { usuarioId },
            orderBy: { fecha: "desc" },
            select: { preguntaId: true },
        }),
    ]);

    const ultimo = new Map();
    for (const r of [...diarias, ...practicas]) {
        const actual = ultimo.get(r.preguntaId);
        if (!actual || r.fecha > actual.fecha) ultimo.set(r.preguntaId, r);
    }

    const candidatos =
        ids.length > 1 && ultima ? ids.filter((id) => id !== ultima.preguntaId) : ids;

    const prioridad = (id) => {
        const u = ultimo.get(id);
        return !u ? 0 : u.acierto ? 2 : 1;
    };
    const mejor = Math.min(...candidatos.map(prioridad));
    const grupo = candidatos.filter((id) => prioridad(id) === mejor);
    return grupo[Math.floor(Math.random() * grupo.length)];
}