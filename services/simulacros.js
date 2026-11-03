import { prisma } from "../lib/prisma";

export const SIMULACRO_PREGUNTAS = 20;
export const SIMULACRO_MINUTOS = 30;

const GRACIA_MS = 5000;

function fechaHoy() {
    const texto = new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Bogota",
    });
    return new Date(texto + "T00:00:00.000Z");
}

function soloDeDiasAnteriores() {
    return { delDia: { some: { fecha: { lt: fechaHoy() } } } };
}

function mezclar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function elegirEquilibradas(preguntas, cantidad) {
    const grupos = new Map();
    for (const p of preguntas) {
        if (!grupos.has(p.areaId)) grupos.set(p.areaId, []);
        grupos.get(p.areaId).push(p);
    }

    const cuota = Math.ceil(cantidad / grupos.size);
    const elegidas = [];
    const sobrantes = [];
    for (const lista of grupos.values()) {
        const mezcladas = mezclar(lista);
        elegidas.push(...mezcladas.slice(0, cuota));
        sobrantes.push(...mezcladas.slice(cuota));
    }

    const faltan = cantidad - elegidas.length;
    if (faltan > 0) elegidas.push(...mezclar(sobrantes).slice(0, faltan));

    return mezclar(elegidas).slice(0, cantidad);
}

export async function preguntasDisponibles() {
    return prisma.pregunta.count({ where: soloDeDiasAnteriores() });
}

export async function crearSimulacro(
    usuarioId,
    cantidad = SIMULACRO_PREGUNTAS,
    minutos = SIMULACRO_MINUTOS
) {
    const activo = await prisma.simulacro.findFirst({
        where: { usuarioId, terminado: null, fin: { gt: new Date() } },
        select: { id: true },
    });
    if (activo) return activo.id;

    const todas = await prisma.pregunta.findMany({
        where: soloDeDiasAnteriores(),
        select: { id: true, areaId: true },
    });
    if (todas.length === 0) return null;

    const elegidas = elegirEquilibradas(todas, cantidad);
    const tiempo = Math.max(1, Math.round((minutos * elegidas.length) / cantidad));
    const fin = new Date(Date.now() + tiempo * 60 * 1000);

    const simulacro = await prisma.simulacro.create({
        data: {
            usuarioId,
            fin,
            preguntas: {
                create: elegidas.map((p, i) => ({ preguntaId: p.id, orden: i })),
            },
        },
    });
    return simulacro.id;
}

export async function terminarSimulacro(id, usuarioId) {
    await prisma.simulacro.updateMany({
        where: { id, usuarioId, terminado: null },
        data: { terminado: new Date() },
    });
}

export async function guardarRespuesta(simulacroId, usuarioId, preguntaId, opcionId) {
    const simulacro = await prisma.simulacro.findFirst({
        where: { id: simulacroId, usuarioId, terminado: null },
        select: { fin: true },
    });
    if (!simulacro) return false;

    if (Date.now() > simulacro.fin.getTime() + GRACIA_MS) {
        await terminarSimulacro(simulacroId, usuarioId);
        return false;
    }

    const opcionValida = await prisma.opcion.findFirst({
        where: { id: opcionId, preguntaId },
        select: { id: true },
    });
    if (!opcionValida) return false;

    const resultado = await prisma.simulacroPregunta.updateMany({
        where: { simulacroId, preguntaId, opcionId: null },
        data: { opcionId },
    });
    return resultado.count === 1;
}

export async function obtenerSimulacro(id, usuarioId) {
    const base = await prisma.simulacro.findFirst({
        where: { id, usuarioId },
        select: { fin: true, terminado: true },
    });
    if (!base) return null;

    if (!base.terminado && Date.now() > base.fin.getTime()) {
        await terminarSimulacro(id, usuarioId);
    }

    const simulacro = await prisma.simulacro.findFirst({
        where: { id, usuarioId },
        include: {
            preguntas: {
                orderBy: { orden: "asc" },
                include: {
                    pregunta: {
                        include: {
                            area: true,
                            opciones: { orderBy: { id: "asc" } },
                        },
                    },
                },
            },
        },
    });

    if (!simulacro.terminado) {
        for (const sp of simulacro.preguntas) {
            delete sp.pregunta.explicacion;
            for (const o of sp.pregunta.opciones) delete o.esCorrecta;
        }
    }

    simulacro.restanteMs = Math.max(0, simulacro.fin.getTime() - Date.now());
    return simulacro;
}