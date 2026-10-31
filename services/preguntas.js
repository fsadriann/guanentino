import { prisma } from "../lib/prisma";

function fechaHoy() {
    const texto = new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Bogota",
    });
    return new Date(texto + "T00:00:00.000Z");
}

export async function preguntaDelDia(areaId) {
    const fecha = fechaHoy();
    const incluir = {
        pregunta: {
            include: { opciones: { orderBy: { id: "asc" } }, area: true },
        },
    };
    const clave = { fecha_areaId: { fecha, areaId } };

    const existente = await prisma.preguntaDelDia.findUnique({
        where: clave,
        include: incluir,
    });
    if (existente) return existente.pregunta;

    const usadas = await prisma.preguntaDelDia.findMany({
        where: { areaId },
        select: { preguntaId: true },
    });
    let candidatas = await prisma.pregunta.findMany({
        where: { areaId, id: { notIn: usadas.map((u) => u.preguntaId) } },
        select: { id: true },
    });
    if (candidatas.length === 0) {
        candidatas = await prisma.pregunta.findMany({
            where: { areaId },
            select: { id: true },
        });
    }
    if (candidatas.length === 0) return null;

    const elegida = candidatas[Math.floor(Math.random() * candidatas.length)];

    try {
        await prisma.preguntaDelDia.create({
            data: { fecha, areaId, preguntaId: elegida.id },
        });
    } catch {
        // otra persona la creó un instante antes, se usa esa
    }

    const registro = await prisma.preguntaDelDia.findUnique({
        where: clave,
        include: incluir,
    });
    return registro ? registro.pregunta : null;
}