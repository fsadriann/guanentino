import { prisma } from "../lib/prisma";

function diaBogota(fecha) {
    return fecha.toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

function restarDia(texto) {
    const f = new Date(texto + "T00:00:00.000Z");
    f.setUTCDate(f.getUTCDate() - 1);
    return f.toISOString().slice(0, 10);
}

export function calcularRacha(fechas) {
    const dias = new Set(fechas.map(diaBogota));
    let dia = diaBogota(new Date());
    if (!dias.has(dia)) dia = restarDia(dia);

    let racha = 0;
    while (dias.has(dia)) {
        racha++;
        dia = restarDia(dia);
    }
    return racha;
}

export async function estadisticasUsuario(usuarioId) {
    const respuestas = await prisma.respuesta.findMany({
        where: { usuarioId },
        select: { fecha: true, acierto: true, puntaje: true },
    });

    const grupos = await prisma.respuesta.groupBy({
        by: ["usuarioId"],
        _sum: { puntaje: true },
        orderBy: { _sum: { puntaje: "desc" } },
    });
    const indice = grupos.findIndex((g) => g.usuarioId === usuarioId);

    return {
        puntos: respuestas.reduce((suma, r) => suma + r.puntaje, 0),
        respondidas: respuestas.length,
        aciertos: respuestas.filter((r) => r.acierto).length,
        racha: calcularRacha(respuestas.map((r) => r.fecha)),
        posicion: indice === -1 ? null : indice + 1,
    };
}