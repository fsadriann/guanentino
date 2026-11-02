"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { exigirSesion } from "../../lib/permisos";
import { poolPractica, resumenHoy } from "../../services/practica";

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

    if (!Number.isInteger(preguntaId) || !Number.isInteger(opcionId)) {
        redirect("/practica");
    }

    const resumen = await resumenHoy(usuarioId);
    if (resumen.llegoAlLimite) redirect("/practica?limite=1");

    const pool = await poolPractica();
    if (!pool.some((p) => p.id === preguntaId)) redirect("/practica");

    const pregunta = await prisma.pregunta.findUnique({
        where: { id: preguntaId },
        include: { opciones: true },
    });
    const opcion = pregunta?.opciones.find((o) => o.id === opcionId);
    if (!opcion) redirect("/practica/" + destino);

    const registro = await prisma.respuestaPractica.create({
        data: { usuarioId, preguntaId, opcionId, acierto: opcion.esCorrecta },
    });

    redirect("/practica/respuesta/" + registro.id + "?destino=" + destino);
}