"use client";

import { useActionState } from "react";
import { importarPreguntas } from "./actions";

export default function Formulario() {
    const [estado, accion, pendiente] = useActionState(importarPreguntas, null);

    return (
        <form action={accion} className="flex flex-col gap-3">
            <input
                type="file"
                name="archivo"
                accept=".json,application/json"
                className="campo"
                required
            />

            {estado?.error && <p className="mensaje-error">{estado.error}</p>}
            {estado?.detalles && (
                <ul className="mensaje-error list-disc pl-8">
                    {estado.detalles.map((d, i) => (
                        <li key={i}>{d}</li>
                    ))}
                </ul>
            )}
            {estado?.ok && <p className="mensaje-ok">{estado.ok}</p>}

            <button disabled={pendiente} className="boton boton-ancho">
                {pendiente ? "Cargando..." : "Cargar preguntas"}
            </button>
        </form>
    );
}