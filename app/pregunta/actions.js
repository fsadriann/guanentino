"use server";

import { revalidatePath } from "next/cache";
import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";
import { preguntaDelDia } from "../../services/preguntas";

export async function responder(formData) {
    const sesion = await auth();
    if (!sesion) return;

    const areaId = Number(formData.get("areaId"));
    const opcionId = Number(formData.get("opcionId"));
    if (!Number.isInteger(areaId)) return;

    const pregunta = await preguntaDelDia(areaId);
    if (!pregunta) return;

    const opcion = pregunta.opciones.find((o) => o.id === opcionId);
    if (!opcion) return;

    try {
        await prisma.respuesta.create({
            data: {
                usuarioId: Number(sesion.user.id),
                preguntaId: pregunta.id,
                opcionId,
                acierto: opcion.esCorrecta,
                puntaje: opcion.esCorrecta ? 10 : 0,
            },
        });
    } catch {
        // si ya había respondido, la base de datos lo rechaza y no pasa nada
    }

    revalidatePath("/pregunta");
    revalidatePath("/pregunta/" + areaId);
}