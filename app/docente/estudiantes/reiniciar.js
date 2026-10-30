"use client";

import { useActionState } from "react";
import { restablecerClave } from "./actions";

export default function Reiniciar({ usuarioId }) {
    const [estado, accion, pendiente] = useActionState(restablecerClave, null);

    return (
        <form action={accion} className="flex items-center gap-2">
            <input type="hidden" name="usuarioId" value={usuarioId} />
            <button
                disabled={pendiente}
                onClick={(e) => {
                    if (!confirm("¿Restablecer la clave de este estudiante?")) {
                        e.preventDefault();
                    }
                }}
                className="rounded border px-2 py-1 text-sm"
            >
                {pendiente ? "..." : "Restablecer clave"}
            </button>
            {estado?.clave && (
                <span className="font-mono text-green-600">{estado.clave}</span>
            )}
            {estado?.error && <span className="text-red-600">{estado.error}</span>}
        </form>
    );
}