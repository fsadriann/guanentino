"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { exigirSesion } from "../../lib/permisos";
import { poolPractica, resumenHoy } from "../../services/practica";

const UUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function responderPractica(formData) {
    const sesion = await exigirSesion();
    const usuarioId = Number(sesion.user.id);

    const preguntaId = Number(formData.get("preguntaId"));
    const opcionId = Number(formData.get("opcionId"));
    const destinoCrudo = String(formData.get("destino") ?? "todas");
    const destino =
        destinoCrudo === "todas" || /^\d+$/.test(destinoCrudo)
            ? destinoCrudo
            : "todas";
    const sesionCruda = String(formData.get("sesion") ?? "");
    const sesionPractica = UUID.test(sesionCruda) ? sesionCruda : randomUUID();
    const areaId = destino === "todas" ? null : Number(destino);

    if (!Number.isInteger(preguntaId) || !Number.isInteger(opcionId)) {
        redirect("/practica");
    }

    const resumen = await resumenHoy(usuarioId);
    if (resumen.llegoAlLimite) redirect("/practica?limite=1");

    const pool = await poolPractica(usuarioId, areaId, sesionPractica);
    if (!pool.some((p) => p.id === preguntaId)) {
        redirect("/practica/" + destino + "?s=" + sesionPractica);
    }

    const pregunta = await prisma.pregunta.findUnique({
        where: { id: preguntaId },
        include: { opciones: true },
    });
    const opcion = pregunta?.opciones.find((o) => o.id === opcionId);
    if (!opcion) redirect("/practica/" + destino + "?s=" + sesionPractica);

    const registro = await prisma.respuestaPractica.create({
        data: {
            usuarioId,
            preguntaId,
            opcionId,
            acierto: opcion.esCorrecta,
            sesion: sesionPractica,
        },
    });

    redirect("/practica/respuesta/" + registro.id + "?destino=" + destino);
}