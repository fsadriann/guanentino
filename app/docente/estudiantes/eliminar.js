"use client";

import { useActionState, useState } from "react";
import { Trash2 } from "lucide-react";
import { eliminarEstudiante } from "./actions";

export default function Eliminar({ usuarioId, usuario }) {
    const [estado, accion, pendiente] = useActionState(eliminarEstudiante, null);
    const [texto, setTexto] = useState("");
    const coincide = texto.trim() === usuario;

    return (
        <details>
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-extrabold text-rojo [&::-webkit-details-marker]:hidden">
                <Trash2 size={16} strokeWidth={2.5} /> Eliminar estudiante
            </summary>

            <form action={accion} className="mt-3 flex flex-col gap-3">
                <input type="hidden" name="usuarioId" value={usuarioId} />
                <p className="text-sm text-gris">
                    Se borrarán su perfil, sus respuestas y sus puntos. No se puede
                    deshacer. Para confirmar escribe su usuario{" "}
                    <span className="font-extrabold text-texto">{usuario}</span>.
                </p>
                <input
                    name="confirmacion"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Usuario del estudiante"
                    autoComplete="off"
                    className="campo"
                />

                {estado?.error && <p className="mensaje-error">{estado.error}</p>}

                <button
                    disabled={!coincide || pendiente}
                    className="boton boton-rojo gap-2 px-4 py-2 text-xs"
                >
                    <Trash2 size={14} strokeWidth={2.5} />
                    {pendiente ? "Eliminando..." : "Eliminar definitivamente"}
                </button>
            </form>
        </details>
    );
}