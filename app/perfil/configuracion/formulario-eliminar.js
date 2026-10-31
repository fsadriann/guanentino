"use client";

import { useActionState, useState } from "react";
import { Trash2, TriangleAlert } from "lucide-react";
import { eliminarCuenta } from "./actions";

export default function FormularioEliminar({ puedeEliminar }) {
    const [estado, accion, pendiente] = useActionState(eliminarCuenta, null);
    const [texto, setTexto] = useState("");
    const [clave, setClave] = useState("");

    const listo = texto.trim().toUpperCase() === "ELIMINAR" && clave.length > 0;

    if (!puedeEliminar) {
        return (
            <div className="tarjeta text-sm text-gris">
                Las cuentas de docente no se eliminan desde aquí. Pídele a otro docente
                o al administrador que lo haga.
            </div>
        );
    }

    return (
        <details className="tarjeta border-rojo">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-extrabold text-rojo [&::-webkit-details-marker]:hidden">
                <Trash2 size={20} strokeWidth={2.5} /> Eliminar mi cuenta
            </summary>

            <form action={accion} className="mt-4 flex flex-col gap-3">
                <p className="flex items-start gap-2 text-sm">
                    <TriangleAlert
                        size={18}
                        strokeWidth={2.5}
                        className="mt-0.5 shrink-0 text-rojo"
                    />
                    Se borrarán tu perfil, tus respuestas, tus puntos y tu racha. Esto no
                    se puede deshacer.
                </p>

                <input
                    name="confirmacion"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Escribe ELIMINAR"
                    autoComplete="off"
                    className="campo"
                />
                <input
                    name="clave"
                    type="password"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    placeholder="Tu clave actual"
                    autoComplete="current-password"
                    className="campo"
                />

                {estado?.error && <p className="mensaje-error">{estado.error}</p>}

                <button
                    disabled={!listo || pendiente}
                    className="boton boton-rojo boton-ancho gap-2"
                >
                    <Trash2 size={18} strokeWidth={2.5} />
                    {pendiente ? "Eliminando..." : "Eliminar mi cuenta"}
                </button>
            </form>
        </details>
    );
}