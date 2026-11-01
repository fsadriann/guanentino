"use client";

import { useActionState } from "react";
import { reportarPregunta } from "../reportar";

const motivos = [
    ["RESPUESTA_INCORRECTA", "La respuesta correcta parece estar mal"],
    ["ENUNCIADO_CONFUSO", "La pregunta es confusa o está incompleta"],
    ["ERROR_DE_TEXTO", "Tiene un error de ortografía o de texto"],
    ["OTRO", "Otro problema"],
];

export default function FormularioReporte({ preguntaId }) {
    const [estado, accion, pendiente] = useActionState(reportarPregunta, null);

    if (estado?.ok) return <p className="mensaje-ok mt-3">{estado.ok}</p>;

    return (
        <form action={accion} className="mt-4 flex flex-col gap-3">
            <input type="hidden" name="preguntaId" value={preguntaId} />

            <fieldset className="flex flex-col gap-2">
                <legend className="sr-only">Motivo del reporte</legend>
                {motivos.map(([valor, texto]) => (
                    <label key={valor} className="cursor-pointer">
                        <input
                            type="radio"
                            name="motivo"
                            value={valor}
                            required
                            className="peer sr-only"
                        />
                        <div className="tarjeta py-3 text-sm peer-checked:border-azul peer-checked:bg-azul-claro peer-focus-visible:ring-2 peer-focus-visible:ring-azul">
                            {texto}
                        </div>
                    </label>
                ))}
            </fieldset>

            <textarea
                name="comentario"
                rows={3}
                maxLength={500}
                placeholder="Cuéntanos más (opcional)"
                className="campo"
            />

            {estado?.error && <p className="mensaje-error">{estado.error}</p>}

            <button disabled={pendiente} className="boton boton-secundario boton-ancho">
                {pendiente ? "Enviando..." : "Enviar reporte"}
            </button>
        </form>
    );
}