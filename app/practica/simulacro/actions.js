"use server";

import { redirect } from "next/navigation";
import { exigirSesion } from "../../../lib/permisos";
import {
    crearSimulacro,
    guardarRespuesta,
    terminarSimulacro,
} from "../../../services/simulacros";

export async function iniciarSimulacro() {
    const sesion = await exigirSesion();
    const id = await crearSimulacro(Number(sesion.user.id));
    if (id === null) redirect("/practica/simulacro");
    redirect("/practica/simulacro/" + id);
}

export async function responderSimulacro(formData) {
    const sesion = await exigirSesion();
    const simulacroId = Number(formData.get("simulacroId"));
    const preguntaId = Number(formData.get("preguntaId"));
    const opcionId = Number(formData.get("opcionId"));

    if (![simulacroId, preguntaId, opcionId].every(Number.isInteger)) {
        redirect("/practica/simulacro");
    }

    await guardarRespuesta(
        simulacroId,
        Number(sesion.user.id),
        preguntaId,
        opcionId
    );
    redirect("/practica/simulacro/" + simulacroId);
}

export async function finalizarSimulacro(simulacroId) {
    const sesion = await exigirSesion();
    await terminarSimulacro(Number(simulacroId), Number(sesion.user.id));
    redirect("/practica/simulacro/" + Number(simulacroId) + "/resultado");
}