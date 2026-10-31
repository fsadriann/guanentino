import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";

export async function GET() {
    const sesion = await auth();
    if (!sesion) return new Response("No autorizado", { status: 401 });

    const id = Number(sesion.user.id);
    const usuario = await prisma.usuario.findUnique({
        where: { id },
        select: {
            usuario: true,
            nombre: true,
            apellido: true,
            correo: true,
            colegio: true,
            rol: true,
            creadoEn: true,
            avatarIcono: true,
            avatarColor: true,
            ocultoEnRanking: true,
        },
    });
    if (!usuario) return new Response("No encontrado", { status: 404 });

    const respuestas = await prisma.respuesta.findMany({
        where: { usuarioId: id },
        orderBy: { fecha: "asc" },
        include: {
            pregunta: {
                include: { area: true, opciones: { orderBy: { id: "asc" } } },
            },
        },
    });

    const datos = {
        generadoEn: new Date().toISOString(),
        perfil: usuario,
        respuestas: respuestas.map((r) => ({
            fecha: r.fecha,
            area: r.pregunta.area.nombre,
            pregunta: r.pregunta.enunciado,
            tuRespuesta: r.pregunta.opciones.find((o) => o.id === r.opcionId)?.texto ?? null,
            respuestaCorrecta: r.pregunta.opciones.find((o) => o.esCorrecta)?.texto ?? null,
            acierto: r.acierto,
            puntaje: r.puntaje,
        })),
    };

    return new Response(JSON.stringify(datos, null, 2), {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Content-Disposition": 'attachment; filename="mis-datos-guanentino.json"',
            "Cache-Control": "no-store",
        },
    });
}