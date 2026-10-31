"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { exigirDocente } from "../../../lib/permisos";

const MAX_BYTES = 1_000_000;

const esquemaPregunta = z.object({
    area: z.string().trim().min(1, "falta el área"),
    enunciado: z.string().trim().min(5, "el enunciado es muy corto"),
    opciones: z
        .array(z.string().trim().min(1, "hay una opción vacía"))
        .length(4, "debe tener exactamente 4 opciones"),
    correcta: z.enum(["A", "B", "C", "D"], {
        message: "correcta debe ser A, B, C o D",
    }),
    explicacion: z.string().trim().min(5, "la explicación es muy corta"),
});

const esquemaArchivo = z
    .array(esquemaPregunta)
    .min(1, "el archivo no tiene preguntas")
    .max(200, "máximo 200 preguntas por archivo");

function normalizar(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

export async function importarPreguntas(estadoPrevio, formData) {
    await exigirDocente();

    const archivo = formData.get("archivo");
    if (!archivo || typeof archivo === "string" || archivo.size === 0) {
        return { error: "Elige un archivo .json" };
    }
    if (archivo.size > MAX_BYTES) {
        return { error: "El archivo es muy grande, el máximo es 1 MB" };
    }

    let datos;
    try {
        datos = JSON.parse(await archivo.text());
    } catch {
        return {
            error: "El archivo no es un JSON válido. Revisa las comas y las comillas",
        };
    }

    const resultado = esquemaArchivo.safeParse(datos);
    if (!resultado.success) {
        const detalles = resultado.error.issues.slice(0, 8).map((i) =>
            typeof i.path[0] === "number"
                ? "Pregunta " + (i.path[0] + 1) + " " + i.message
                : i.message
        );
        return { error: "El archivo tiene errores y no se cargó nada", detalles };
    }
    const preguntas = resultado.data;

    const areas = await prisma.area.findMany();
    const areaPorNombre = new Map(areas.map((a) => [normalizar(a.nombre), a.id]));

    const sinArea = [];
    preguntas.forEach((p, i) => {
        if (!areaPorNombre.has(normalizar(p.area))) {
            sinArea.push("Pregunta " + (i + 1) + " el área " + p.area + " no existe");
        }
    });
    if (sinArea.length > 0) {
        return {
            error:
                "Hay áreas que no existen y no se cargó nada. Las válidas son " +
                areas.map((a) => a.nombre).join(", "),
            detalles: sinArea.slice(0, 8),
        };
    }

    const existentes = await prisma.pregunta.findMany({
        select: { areaId: true, enunciado: true },
    });
    const vistas = new Set(
        existentes.map((e) => e.areaId + "|" + normalizar(e.enunciado))
    );

    const nuevas = [];
    let repetidas = 0;
    for (const p of preguntas) {
        const areaId = areaPorNombre.get(normalizar(p.area));
        const llave = areaId + "|" + normalizar(p.enunciado);
        if (vistas.has(llave)) {
            repetidas++;
            continue;
        }
        vistas.add(llave);
        nuevas.push({ ...p, areaId });
    }

    const indice = { A: 0, B: 1, C: 2, D: 3 };
    if (nuevas.length > 0) {
        await prisma.$transaction(
            async (tx) => {
                const creadas = await tx.pregunta.createManyAndReturn({
                    data: nuevas.map((p) => ({
                        enunciado: p.enunciado,
                        explicacion: p.explicacion,
                        areaId: p.areaId,
                    })),
                    select: { id: true, areaId: true, enunciado: true },
                });

                const idPorLlave = new Map(
                    creadas.map((c) => [c.areaId + "|" + normalizar(c.enunciado), c.id])
                );

                await tx.opcion.createMany({
                    data: nuevas.flatMap((p) => {
                        const preguntaId = idPorLlave.get(
                            p.areaId + "|" + normalizar(p.enunciado)
                        );
                        return p.opciones.map((texto, i) => ({
                            texto,
                            esCorrecta: i === indice[p.correcta],
                            preguntaId,
                        }));
                    }),
                });
            },
            { maxWait: 10000, timeout: 30000 }
        );
    }

    revalidatePath("/docente");
    revalidatePath("/docente/preguntas");

    return {
        ok:
            "Se cargaron " +
            nuevas.length +
            " preguntas" +
            (repetidas > 0 ? " y se omitieron " + repetidas + " que ya existían" : ""),
    };
}