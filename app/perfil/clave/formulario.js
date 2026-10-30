"use client";

import { useActionState } from "react";
import { cambiarClave } from "./actions";

export default function Formulario() {
    const [estado, accion, pendiente] = useActionState(cambiarClave, null);

    return (
        <form action={accion} className="flex flex-col gap-3">
            <input name="actual" type="password" placeholder="Clave actual" className="rounded border p-2" required />
            <input name="nueva" type="password" placeholder="Clave nueva (mínimo 8 caracteres)" className="rounded border p-2" required />
            <input name="repetir" type="password" placeholder="Repite la clave nueva" className="rounded border p-2" required />
            {estado?.error && <p className="text-red-600">{estado.error}</p>}
            {estado?.ok && <p className="text-green-600">{estado.ok}</p>}
            <button disabled={pendiente} className="rounded bg-blue-600 p-2 text-white">
                {pendiente ? "Guardando..." : "Cambiar clave"}
            </button>
        </form>
    );
}