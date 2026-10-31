"use client";

import { useActionState } from "react";
import { cambiarCorreo } from "./actions";

export default function FormularioCorreo({ correo }) {
    const [estado, accion, pendiente] = useActionState(cambiarCorreo, null);

    return (
        <form action={accion} className="flex flex-col gap-3">
            <input
                name="correo"
                type="email"
                defaultValue={correo}
                placeholder="Correo"
                autoComplete="email"
                className="campo"
                required
            />
            <input
                name="clave"
                type="password"
                placeholder="Tu clave actual para confirmar"
                autoComplete="current-password"
                className="campo"
                required
            />

            {estado?.error && <p className="mensaje-error">{estado.error}</p>}
            {estado?.ok && <p className="mensaje-ok">{estado.ok}</p>}

            <button disabled={pendiente} className="boton boton-secundario boton-ancho">
                {pendiente ? "Guardando..." : "Cambiar correo"}
            </button>
        </form>
    );
}