"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { exigirDocente } from "../../../lib/permisos";

export async function borrarPregunta(formData) {
    await exigirDocente();
    const id = Number(formData.get("preguntaId"));
    if (!Number.isInteger(id)) return;

    const pregunta = await prisma.pregunta.findUnique({
        where: { id },
        select: { imagenId: true, _count: { select: { respuestas: true } } },
    });
    if (!pregunta || pregunta._count.respuestas > 0) return;

    const operaciones = [
        prisma.respuestaPractica.deleteMany({ where: { preguntaId: id } }),
        prisma.reportePregunta.deleteMany({ where: { preguntaId: id } }),
        prisma.preguntaDelDia.deleteMany({ where: { preguntaId: id } }),
        prisma.opcion.deleteMany({ where: { preguntaId: id } }),
        prisma.pregunta.delete({ where: { id } }),
    ];
    if (pregunta.imagenId) {
        operaciones.push(
            prisma.imagen.deleteMany({ where: { id: pregunta.imagenId } })
        );
    }
    await prisma.$transaction(operaciones);

    revalidatePath("/docente/preguntas");
}