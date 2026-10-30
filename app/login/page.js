"use client";

import { useActionState } from "react";
import { iniciarSesion } from "./actions";

export default function Login() {
    const [estado, accion, pendiente] = useActionState(iniciarSesion, null);

    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="mb-4 text-2xl font-bold">Iniciar sesión</h1>
            <form action={accion} className="flex flex-col gap-3">
                <input name="usuario" placeholder="Usuario" className="rounded border p-2" required />
                <input name="clave" type="password" placeholder="Clave" className="rounded border p-2" required />
                {estado?.error && <p className="text-red-600">{estado.error}</p>}
                <button disabled={pendiente} className="rounded bg-blue-600 p-2 text-white">
                    {pendiente ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </main>
    );
}