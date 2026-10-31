"use client";

import Link from "next/link";
import { useActionState } from "react";
import { cambiarClave } from "./actions";

export default function Formulario() {
    const [estado, accion, pendiente] = useActionState(cambiarClave, null);

    return (
        <form action={accion} className="flex flex-col gap-3">
            <input name="actual" type="password" placeholder="Clave actual" autoComplete="current-password" className="campo" required />
            <input name="nueva" type="password" placeholder="Clave nueva (mínimo 8 caracteres)" autoComplete="new-password" className="campo" required />
            <input name="repetir" type="password" placeholder="Repite la clave nueva" autoComplete="new-password" className="campo" required />

            {estado?.error && <p className="mensaje-error">{estado.error}</p>}
            {estado?.ok && (
                <p className="mensaje-ok">
                    {estado.ok}.{" "}
                    <Link href="/pregunta" className="underline">
                        Ir a las preguntas
                    </Link>
                </p>
            )}

            <button disabled={pendiente} className="boton boton-ancho">
                {pendiente ? "Guardando..." : "Cambiar clave"}
            </button>
        </form>
    );
}