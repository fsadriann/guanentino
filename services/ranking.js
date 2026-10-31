import { prisma } from "../lib/prisma";

export async function topRanking(limite = 10) {
    const grupos = await prisma.respuesta.groupBy({
        by: ["usuarioId"],
        where: { usuario: { ocultoEnRanking: false } },
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