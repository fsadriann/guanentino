"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { exigirDocente } from "../../lib/permisos";
import { crearImagen, procesarImagen } from "../../lib/imagenes";

const esquema = z.object({
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

export async function crearPregunta(estadoPrevio, formData) {
    await exigirDocente();

    const datos = esquema.safeParse({
        areaId: formData.get("areaId"),
        enunciado: formData.get("enunciado") ?? "",
        explicacion: formData.get("explicacion") ?? "",
        correcta: formData.get("correcta") ?? "",
        opciones: [0, 1, 2, 3].map((i) => formData.get("opcion" + i) ?? ""),
        imagenAlt: formData.get("imagenAlt") ?? "",
    });
    if (!datos.success) return { error: datos.error.issues[0].message };
    const { areaId, enunciado, explicacion, opciones, imagenAlt } = datos.data;
    const correcta = Number(datos.data.correcta);

    const area = await prisma.area.findUnique({
        where: { id: areaId },
        select: { id: true },
    });
    if (!area) return { error: "El área no existe" };

    const procesada = await procesarImagen(formData.get("imagen"));
    if (procesada.error) return { error: procesada.error };
    const hayImagen = !procesada.vacio;
    if (hayImagen && !imagenAlt) {
        return {
            error: "Describe la imagen en una frase para quienes no pueden verla",
        };
    }

    const imagenId = hayImagen ? await crearImagen(procesada) : null;

    await prisma.pregunta.create({
        data: {
            enunciado,
            explicacion,
            areaId,
            imagenId,
            imagenAlt: imagenId ? imagenAlt : null,
            opciones: {
                create: opciones.map((texto, i) => ({
                    texto,
                    esCorrecta: i === correcta,
                })),
            },
        },
    });

    revalidatePath("/docente");
    revalidatePath("/docente/preguntas");
    return { ok: "Pregunta guardada" };
}