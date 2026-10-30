import { prisma } from "../lib/prisma";

export async function topRanking(limite = 10) {
    const grupos = await prisma.respuesta.groupBy({
        by: ["usuarioId"],
        _sum: { puntaje: true },
        _count: { _all: true },
        orderBy: { _sum: { puntaje: "desc" } },
        take: limite,
    });

    const usuarios = await prisma.usuario.findMany({
        where: { id: { in: grupos.map((g) => g.usuarioId) } },
        select: { id: true, usuario: true },
    });

    return grupos.map((g, i) => ({
        posicion: i + 1,
        id: g.usuarioId,
        usuario: usuarios.find((u) => u.id === g.usuarioId).usuario,
        puntos: g._sum.puntaje ?? 0,
        respondidas: g._count._all,
    }));
}