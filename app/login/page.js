"use client";

import Link from "next/link";
import { useActionState } from "react";
import { iniciarSesion } from "./actions";

export default function Login() {
    const [estado, accion, pendiente] = useActionState(iniciarSesion, null);

    return (
        <main className="mx-auto max-w-sm p-6">
            <h1 className="mb-6 text-center text-2xl font-extrabold">Iniciar sesión</h1>
            <form action={accion} className="flex flex-col gap-3">
                <input name="usuario" placeholder="Usuario" className="campo" required />
                <input name="clave" type="password" placeholder="Clave" className="campo" required />
                {estado?.error && <p className="mensaje-error">{estado.error}</p>}
                <button disabled={pendiente} className="boton boton-ancho">
                    {pendiente ? "Entrando..." : "Entrar"}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gris">
                ¿No tienes cuenta?{" "}
                <Link href="/registro" className="font-extrabold text-azul">
                    Regístrate
                </Link>
            </p>
        </main>
    );
}