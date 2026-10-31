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
                className="rounded border p-2"
                required
            />

            {estado?.error && <p className="text-red-600">{estado.error}</p>}
            {estado?.detalles && (
                <ul className="list-disc pl-6 text-red-600">
                    {estado.detalles.map((d, i) => (
                        <li key={i}>{d}</li>
                    ))}
                </ul>
            )}
            {estado?.ok && <p className="text-green-600">{estado.ok}</p>}

            <button disabled={pendiente} className="rounded bg-blue-600 p-2 text-white">
                {pendiente ? "Cargando..." : "Cargar preguntas"}
            </button>
        </form>
    );
}