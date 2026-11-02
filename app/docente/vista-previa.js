"use server";

import { exigirDocente } from "../../lib/permisos";
import { textoAHtml } from "../../lib/matematicas";

function limitar(texto) {
    return String(texto ?? "").slice(0, 5000);
}

export async function vistaPrevia({ enunciado, opciones, explicacion }) {
    await exigirDocente();

    return {
        enunciado: textoAHtml(limitar(enunciado)),
        opciones: (Array.isArray(opciones) ? opciones.slice(0, 4) : []).map((o) =>
            textoAHtml(limitar(o), { enLinea: true })
        ),
        explicacion: textoAHtml(limitar(explicacion)),
    };
}