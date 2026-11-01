"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { exigirDocente } from "../../../lib/permisos";

export async function resolverReportes(formData) {
    await exigirDocente();

    const preguntaId = Number(formData.get("preguntaId"));
    const estado = String(formData.get("estado"));
    if (!Number.isInteger(preguntaId)) return;
    if (!["RESUELTO", "DESCARTADO"].includes(estado)) return;

    await prisma.reportePregunta.updateMany({
        where: { preguntaId, estado: "PENDIENTE" },
        data: { estado },
    });

    revalidatePath("/docente/reportes");
    revalidatePath("/docente");
}