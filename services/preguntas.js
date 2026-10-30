import { prisma } from "../lib/prisma";

function fechaHoy() {
    const texto = new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Bogota",
    });
    return new Date(texto + "T00:00:00.000Z");
}

export async function preguntaDelDia() {
    const fecha = fechaHoy();
    const incluir = {
        pregunta: {
            include: { opciones: { orderBy: { id: "asc" } }, area: true },
        },
    };

    const existente = await prisma.preguntaDelDia.findUnique({
        where: { fecha },
        include: incluir,
    });
    if (existente) return existente.pregunta;

    const total = await prisma.pregunta.count();
    if (total === 0) return null;

    const elegida = await prisma.pregunta.findFirst({
        skip: Math.floor(Math.random() * total),
    });

    const registro = await prisma.preguntaDelDia.upsert({
        where: { fecha },
        update: {},
        create: { fecha, preguntaId: elegida.id },
        include: incluir,
    });
    return registro.pregunta;
}