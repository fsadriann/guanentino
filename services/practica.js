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

export async function buscarPreguntaPractica(
    usuarioId,
    areaId = null,
    sesion = null,
    preguntaId = null
) {
    if (!Number.isInteger(preguntaId)) return null;
    return prisma.pregunta.findFirst({
        where: {
            id: preguntaId,
            ...filtroPasadas(areaId),
            ...(sesion
                ? { practicas: { none: { usuarioId, sesion } } }
                : {}),
        },
        include: { opciones: { orderBy: { id: "asc" } }, area: true },
    });
}

export async function progresoPractica(usuarioId, areaId = null, sesion = null) {
    const [total, respondidas] = await Promise.all([
        prisma.pregunta.count({ where: filtroPasadas(areaId) }),
        sesion
            ? prisma.respuestaPractica.count({
                  where: {
                      usuarioId,
                      sesion,
                      ...(areaId ? { pregunta: { areaId } } : {}),
                  },
              })
            : 0,
    ]);
    return { total, respondidas };
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
    const pool = await prisma.pregunta.findMany({
        where: {
            ...filtroPasadas(areaId),
            ...(sesion
                ? { practicas: { none: { usuarioId, sesion } } }
                : {}),
            ...(excluirId ? { id: { not: excluirId } } : {}),
        },
        select: {
            id: true,
            respuestas: {
                where: { usuarioId },
                select: { acierto: true, fecha: true },
                orderBy: { fecha: "desc" },
                take: 1,
            },
            practicas: {
                where: { usuarioId },
                select: { acierto: true, fecha: true },
                orderBy: { fecha: "desc" },
                take: 1,
            },
        },
    });
    if (pool.length === 0) return null;

    function ultima(pregunta) {
        const diaria = pregunta.respuestas[0];
        const practica = pregunta.practicas[0];
        if (!diaria) return practica ?? null;
        if (!practica) return diaria;
        return diaria.fecha > practica.fecha ? diaria : practica;
    }

    function prioridad(pregunta) {
        const respuesta = ultima(pregunta);
        return !respuesta ? 0 : respuesta.acierto ? 2 : 1;
    }

    const mejor = Math.min(...pool.map(prioridad));
    const grupo = pool.filter((pregunta) => prioridad(pregunta) === mejor);
    return grupo[Math.floor(Math.random() * grupo.length)].id;
}