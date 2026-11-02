"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { exigirSesion } from "../../lib/permisos";

const esquema = z.object({
    preguntaId: z.coerce.number().int(),
    motivo: z.enum(
        ["RESPUESTA_INCORRECTA", "ENUNCIADO_CONFUSO", "ERROR_DE_TEXTO", "OTRO"],
        { message: "Elige un motivo" }
    ),
    comentario: z
        .string()
        .trim()
        .max(500, "El comentario es muy largo, el máximo es 500 caracteres"),
});

export async function reportarPregunta(estadoPrevio, formData) {
    const sesion = await exigirSesion();

    const datos = esquema.safeParse({
        preguntaId: formData.get("preguntaId"),
        motivo: formData.get("motivo"),
        comentario: formData.get("comentario") ?? "",
    });
    if (!datos.success) return { error: datos.error.issues[0].message };
    const { preguntaId, motivo, comentario } = datos.data;

    const usuarioId = Number(sesion.user.id);
    const clave = { usuarioId_preguntaId: { usuarioId, preguntaId } };

    const [diaria, practica] = await Promise.all([
        prisma.respuesta.findUnique({ where: clave, select: { id: true } }),
        prisma.respuestaPractica.findFirst({
            where: { usuarioId, preguntaId },
            select: { id: true },
        }),
    ]);
    if (!diaria && !practica) {
        return { error: "Solo puedes reportar preguntas que ya respondiste" };
    }

    const existente = await prisma.reportePregunta.findUnique({
        where: clave,
        select: { id: true },
    });
    if (existente) return { error: "Ya reportaste esta pregunta" };

    try {
        await prisma.reportePregunta.create({
            data: { usuarioId, preguntaId, motivo, comentario: comentario || null },
        });
    } catch {
        return { error: "No se pudo enviar el reporte. Intenta de nuevo" };
    }

    revalidatePath("/docente");
    revalidatePath("/docente/reportes");
    return { ok: "Gracias, tu reporte fue enviado" };
}