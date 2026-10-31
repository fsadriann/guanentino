"use client";

import { useActionState } from "react";
import { restablecerClave } from "./actions";

export default function Reiniciar({ usuarioId }) {
    const [estado, accion, pendiente] = useActionState(restablecerClave, null);

    return (
        <form action={accion} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="usuarioId" value={usuarioId} />
            <button
                disabled={pendiente}
                onClick={(e) => {
                    if (!confirm("¿Restablecer la clave de este estudiante?")) {
                        e.preventDefault();
                    }
                }}
                className="boton boton-secundario px-4 py-2 text-xs"
            >
                {pendiente ? "..." : "Restablecer clave"}
            </button>
            {estado?.clave && (
                <span className="mensaje-ok font-mono">{estado.clave}</span>
            )}
            {estado?.error && <span className="mensaje-error">{estado.error}</span>}
        </form>
    );
}