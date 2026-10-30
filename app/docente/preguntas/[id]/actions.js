"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma";
import { exigirDocente } from "../../../../lib/permisos";

const esquema = z.object({
    id: z.coerce.number().int(),
    areaId: z.coerce.number().int(),
    enunciado: z.string().min(5, "Escribe el enunciado"),
    explicacion: z.string().min(5, "Escribe la explicación"),
    correcta: z.coerce.number().int().min(0).max(3),
    opciones: z.array(z.string().min(1, "Escribe las cuatro opciones")).length(4),
});

export async function editarPregunta(estadoPrevio, formData) {
    await exigirDocente();

    const datos = esquema.safeParse({
        id: formData.get("id"),
        areaId: formData.get("areaId"),
        enunciado: formData.get("enunciado"),
        explicacion: formData.get("explicacion"),
        correcta: formData.get("correcta"),
        opciones: [0, 1, 2, 3].map((i) => formData.get("opcion" + i) ?? ""),
    });
    if (!datos.success) return { error: datos.error.issues[0].message };
    const { id, areaId, enunciado, explicacion, correcta, opciones } = datos.data;

    const pregunta = await prisma.pregunta.findUnique({
        where: { id },
        include: {
            opciones: { orderBy: { id: "asc" } },
            _count: { select: { respuestas: true } },
        },
    });
    if (!pregunta || pregunta.opciones.length !== 4) {
        return { error: "No se encontró la pregunta" };
    }

    const correctaActual = pregunta.opciones.findIndex((o) => o.esCorrecta);
    if (pregunta._count.respuestas > 0 && correcta !== correctaActual) {
        return {
            error: "Esta pregunta ya tiene respuestas, no se puede cambiar la opción correcta",
        };
    }

    await prisma.$transaction([
        prisma.pregunta.update({
            where: { id },
            data: { enunciado, explicacion, areaId },
        }),
        ...pregunta.opciones.map((o, i) =>
            prisma.opcion.update({
                where: { id: o.id },
                data: { texto: opciones[i], esCorrecta: i === correcta },
            })
        ),
    ]);

    revalidatePath("/docente/preguntas");
    revalidatePath("/pregunta");
    return { ok: "Cambios guardados" };
}