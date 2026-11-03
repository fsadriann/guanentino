import { prisma } from "../lib/prisma";

function rangoSemanaBogota() {
    const ahora = new Date();
    const textoHoy = ahora.toLocaleDateString("en-CA", {
        timeZone: "America/Bogota",
    });
    const [ano, mes, dia] = textoHoy.split("-").map(Number);
    const hoy = new Date(Date.UTC(ano, mes - 1, dia));
    const diaSemana = hoy.getUTCDay();
    const diasDesdeLunes = (diaSemana + 6) % 7;
    const inicio = new Date(
        Date.UTC(ano, mes - 1, dia - diasDesdeLunes, 5),
    );
    const fin = new Date(inicio);
    fin.setUTCDate(inicio.getUTCDate() + 7);

    return { inicio, fin };
}

export async function topRanking(limite = 10) {
    const { inicio, fin } = rangoSemanaBogota();
    const grupos = await prisma.respuesta.groupBy({
        by: ["usuarioId"],
        where: {
            fecha: { gte: inicio, lt: fin },
            usuario: { ocultoEnRanking: false },
        },
        _sum: { puntaje: true },
        _count: { _all: true },
        orderBy: { _sum: { puntaje: "desc" } },
        take: limite,
    });

    const usuarios = await prisma.usuario.findMany({
        where: { id: { in: grupos.map((g) => g.usuarioId) } },
        select: { id: true, usuario: true, avatarIcono: true, avatarColor: true },
    });

    return grupos.map((g, i) => {
        const u = usuarios.find((x) => x.id === g.usuarioId);
        return {
            posicion: i + 1,
            id: g.usuarioId,
            usuario: u?.usuario ?? "",
            avatarIcono: u?.avatarIcono ?? null,
            avatarColor: u?.avatarColor ?? "azul",
            puntos: g._sum.puntaje ?? 0,
            respondidas: g._count._all,
        };
    });
}

export async function posicionUsuario(usuarioId) {
    const { inicio, fin } = rangoSemanaBogota();
    const grupos = await prisma.respuesta.groupBy({
        by: ["usuarioId"],
        where: {
            fecha: { gte: inicio, lt: fin },
            usuario: { ocultoEnRanking: false },
        },
        _sum: { puntaje: true },
        orderBy: { _sum: { puntaje: "desc" } },
    });
    const indice = grupos.findIndex((g) => g.usuarioId === usuarioId);
    if (indice === -1) return null;

    const puntos = grupos[indice]._sum.puntaje ?? 0;
    const puntosAnterior =
        indice > 0 ? grupos[indice - 1]._sum.puntaje ?? 0 : null;

    return {
        posicion: indice + 1,
        puntos,
        diferenciaAnterior:
            puntosAnterior === null ? null : Math.max(0, puntosAnterior - puntos),
    };
}