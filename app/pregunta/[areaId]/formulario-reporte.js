"use client";

import { useActionState, useState } from "react";
import { Flag } from "lucide-react";
import Hoja from "../../../components/Hoja";
import { reportarPregunta } from "../reportar";

const motivos = [
    ["RESPUESTA_INCORRECTA", "La respuesta correcta parece estar mal"],
    ["ENUNCIADO_CONFUSO", "La pregunta es confusa o está incompleta"],
    ["ERROR_DE_TEXTO", "Tiene un error de ortografía o de texto"],
    ["OTRO", "Otro problema"],
];

export default function FormularioReporte({ preguntaId, yaReportado }) {
    const [abierto, setAbierto] = useState(false);
    const [estado, accion, pendiente] = useActionState(reportarPregunta, null);
    const enviado = yaReportado || Boolean(estado?.ok);

    if (enviado && !abierto) {
        return (
            <p className="flex items-center gap-2 text-sm text-gris">
                <Flag size={16} strokeWidth={2.5} /> Ya reportaste esta pregunta.
                ¡Gracias!
            </p>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setAbierto(true)}
                className="flex items-center gap-2 text-sm font-extrabold text-gris hover:text-texto"
            >
                <Flag size={16} strokeWidth={2.5} /> Reportar un problema con esta
                pregunta
            </button>

            <Hoja
                abierto={abierto}
                onCerrar={() => setAbierto(false)}
                titulo="Reportar un problema"
            >
                {estado?.ok ? (
                    <>
                        <p className="mensaje-ok">{estado.ok}</p>
                        <button
                            type="button"
                            onClick={() => setAbierto(false)}
                            className="boton boton-ancho mt-4"
                        >
                            Cerrar
                        </button>
                    </>
                ) : (
                    <form action={accion} className="flex flex-col gap-3">
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

                        <button disabled={pendiente} className="boton boton-ancho">
                            {pendiente ? "Enviando..." : "Enviar reporte"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setAbierto(false)}
                            className="boton boton-secundario boton-ancho"
                        >
                            Cancelar
                        </button>
                    </form>
                )}
            </Hoja>
        </>
    );
}