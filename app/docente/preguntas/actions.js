"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { exigirDocente } from "../../../lib/permisos";

export async function borrarPregunta(formData) {
    await exigirDocente();
    const id = Number(formData.get("preguntaId"));

    const respuestas = await prisma.respuesta.count({ where: { preguntaId: id } });
    if (respuestas > 0) return;

    await prisma.$transaction([
        prisma.preguntaDelDia.deleteMany({ where: { preguntaId: id } }),
        prisma.opcion.deleteMany({ where: { preguntaId: id } }),
        prisma.pregunta.delete({ where: { id } }),
    ]);

    revalidatePath("/docente/preguntas");
}