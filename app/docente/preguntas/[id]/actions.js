"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma";
import { exigirDocente } from "../../../../lib/permisos";
import { crearImagen, procesarImagen } from "../../../../lib/imagenes";

const esquema = z.object({
    id: z.coerce.number().int(),
    areaId: z.coerce.number().int(),
    enunciado: z
        .string()
        .trim()
        .min(5, "Escribe el enunciado")
        .max(4000, "El enunciado es muy largo"),
    explicacion: z
        .string()
        .trim()
        .min(5, "Escribe la explicación")
        .max(3000, "La explicación es muy larga"),
    correcta: z.enum(["0", "1", "2", "3"], { message: "Marca la opción correcta" }),
    opciones: z
        .array(
            z
                .string()
                .trim()
                .min(1, "Escribe las cuatro opciones")
                .max(500, "Una opción es muy larga")
        )
        .length(4),
    imagenAlt: z.string().trim().max(300, "La descripción de la imagen es muy larga"),
});

export async function editarPregunta(estadoPrevio, formData) {
    await exigirDocente();

    const datos = esquema.safeParse({
        id: formData.get("id"),
        areaId: formData.get("areaId"),
        enunciado: formData.get("enunciado") ?? "",
        explicacion: formData.get("explicacion") ?? "",
        correcta: formData.get("correcta") ?? "",
        opciones: [0, 1, 2, 3].map((i) => formData.get("opcion" + i) ?? ""),
        imagenAlt: formData.get("imagenAlt") ?? "",
    });
    if (!datos.success) return { error: datos.error.issues[0].message };
    const { id, areaId, enunciado, explicacion, opciones, imagenAlt } = datos.data;
    const correcta = Number(datos.data.correcta);

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

    const area = await prisma.area.findUnique({
        where: { id: areaId },
        select: { id: true },
    });
    if (!area) return { error: "El área no existe" };

    const correctaActual = pregunta.opciones.findIndex((o) => o.esCorrecta);
    if (pregunta._count.respuestas > 0 && correcta !== correctaActual) {
        return {
            error:
                "Esta pregunta ya tiene respuestas, no se puede cambiar la opción correcta",
        };
    }

    const procesada = await procesarImagen(formData.get("imagen"));
    if (procesada.error) return { error: procesada.error };
    const hayNueva = !procesada.vacio;
    const quitar = formData.get("quitarImagen") === "on";
    const quedaImagen = hayNueva || (Boolean(pregunta.imagenId) && !quitar);
    if (quedaImagen && !imagenAlt) {
        return {
            error: "Describe la imagen en una frase para quienes no pueden verla",
        };
    }

    const imagenIdNueva = hayNueva
        ? await crearImagen(procesada)
        : quitar
            ? null
            : pregunta.imagenId;

    const operaciones = [
        prisma.pregunta.update({
            where: { id },
            data: {
                enunciado,
                explicacion,
                areaId,
                imagenId: imagenIdNueva,
                imagenAlt: imagenIdNueva ? imagenAlt : null,
            },
        }),
        ...pregunta.opciones.map((o, i) =>
            prisma.opcion.update({
                where: { id: o.id },
                data: { texto: opciones[i], esCorrecta: i === correcta },
            })
        ),
    ];
    if (pregunta.imagenId && pregunta.imagenId !== imagenIdNueva) {
        operaciones.push(
            prisma.imagen.deleteMany({ where: { id: pregunta.imagenId } })
        );
    }
    await prisma.$transaction(operaciones);

    revalidatePath("/docente/preguntas");
    revalidatePath("/pregunta", "layout");
    return { ok: "Cambios guardados" };
}