"use client";

import { useActionState } from "react";
import { registrar } from "./actions";
import Link from "next/link";

export default function Registro() {
    const [estado, accion, pendiente] = useActionState(registrar, null);

    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="mb-4 text-2xl font-bold">Crear cuenta</h1>
            <form action={accion} className="flex flex-col gap-3">
                <input name="usuario" placeholder="Usuario" className="rounded border p-2" required />
                <input name="nombre" placeholder="Nombre" className="rounded border p-2" required />
                <input name="apellido" placeholder="Apellido" className="rounded border p-2" required />
                <input name="correo" type="email" placeholder="Correo" className="rounded border p-2" required />
                <input name="clave" type="password" placeholder="Clave (mínimo 8 caracteres)" className="rounded border p-2" required />
                <input name="colegio" placeholder="Colegio (opcional)" className="rounded border p-2" />
                {estado?.error && <p className="text-red-600">{estado.error}</p>}
                <p className="text-sm opacity-70">
                    Al crear tu cuenta aceptas la{" "}
                    <Link href="/privacidad" className="underline">
                        política de privacidad
                    </Link>
                    .
                </p>
                <button disabled={pendiente} className="rounded bg-blue-600 p-2 text-white">
                    {pendiente ? "Creando..." : "Registrarme"}
                </button>
            </form>
        </main>
    );
}