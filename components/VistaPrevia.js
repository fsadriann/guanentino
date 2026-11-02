"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Eye } from "lucide-react";
import { vistaPrevia } from "../app/docente/vista-previa";

export default function VistaPrevia() {
    const contenedor = useRef(null);
    const [resultado, setResultado] = useState(null);
    const [pendiente, empezar] = useTransition();

    useEffect(() => {
        const formulario = contenedor.current?.closest("form");
        if (!formulario) return;
        const limpiar = () => setResultado(null);
        formulario.addEventListener("reset", limpiar);
        return () => formulario.removeEventListener("reset", limpiar);
    }, []);

    function mostrar() {
        const formulario = contenedor.current?.closest("form");
        if (!formulario) return;
        const datos = new FormData(formulario);
        const entrada = {
            enunciado: String(datos.get("enunciado") ?? ""),
            opciones: [0, 1, 2, 3].map((i) => String(datos.get("opcion" + i) ?? "")),
            explicacion: String(datos.get("explicacion") ?? ""),
        };
        empezar(async () => {
            setResultado(await vistaPrevia(entrada));
        });
    }

    return (
        <div ref={contenedor} className="flex flex-col gap-3">
            <button
                type="button"
                onClick={mostrar}
                disabled={pendiente}
                className="boton boton-secundario gap-2"
            >
                <Eye size={18} strokeWidth={2.5} />
                {pendiente ? "Preparando..." : "Ver vista previa"}
            </button>

            {resultado && (
                <div className="tarjeta flex flex-col gap-3">
                    <p className="text-sm font-extrabold uppercase tracking-wide text-gris">
                        Así se verá
                    </p>
                    <div
                        className="whitespace-pre-line font-extrabold"
                        dangerouslySetInnerHTML={{ __html: resultado.enunciado }}
                    />
                    <div className="flex flex-col gap-2">
                        {resultado.opciones.map((html, i) => (
                            <div key={i} className="tarjeta flex items-center gap-3 py-3">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-borde text-sm font-extrabold text-gris">
                                    {"ABCD"[i]}
                                </span>
                                <span dangerouslySetInnerHTML={{ __html: html }} />
                            </div>
                        ))}
                    </div>
                    <div
                        className="whitespace-pre-line rounded-2xl bg-superficie p-3 text-sm"
                        dangerouslySetInnerHTML={{ __html: resultado.explicacion }}
                    />
                </div>
            )}
        </div>
    );
}