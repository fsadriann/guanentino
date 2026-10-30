"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";

const esquema = z.object({
    areaId: z.coerce.number().int(),
    enunciado: z.string().min(5, "Escribe el enunciado"),
    explicacion: z.string().min(5, "Escribe la explicación"),
    correcta: z.coerce.number().int().min(0).max(3),
    opciones: z.array(z.string().min(1, "Escribe las cuatro opciones")).length(4),
});

export async function crearPregunta(estadoPrevio, formData) {
    const sesion = await auth();
    if (!sesion || !["DOCENTE", "ADMIN"].includes(sesion.user.rol)) {
        return { error: "No tienes permiso para hacer esto" };
    }

    const datos = esquema.safeParse({
        areaId: formData.get("areaId"),
        enunciado: formData.get("enunciado"),
        explicacion: formData.get("explicacion"),
        correcta: formData.get("correcta"),
        opciones: [0, 1, 2, 3].map((i) => formData.get("opcion" + i) ?? ""),
    });
    if (!datos.success) {
        return { error: datos.error.issues[0].message };
    }
    const { areaId, enunciado, explicacion, correcta, opciones } = datos.data;

    await prisma.pregunta.create({
        data: {
            enunciado,
            explicacion,
            areaId,
            opciones: {
                create: opciones.map((texto, i) => ({
                    texto,
                    esCorrecta: i === correcta,
                })),
            },
        },
    });

    revalidatePath("/docente");
    return { ok: "Pregunta guardada" };
}