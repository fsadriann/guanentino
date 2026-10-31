"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registrar } from "./actions";

export default function Registro() {
    const [estado, accion, pendiente] = useActionState(registrar, null);

    return (
        <main className="mx-auto max-w-sm p-6">
            <h1 className="mb-6 text-center text-2xl font-extrabold">Crear cuenta</h1>
            <form action={accion} className="flex flex-col gap-3">
                <input name="usuario" placeholder="Usuario" autoComplete="username" className="campo" required />
                <div className="grid grid-cols-2 gap-3">
                    <input name="nombre" placeholder="Nombre" autoComplete="given-name" className="campo" required />
                    <input name="apellido" placeholder="Apellido" autoComplete="family-name" className="campo" required />
                </div>
                <input name="correo" type="email" placeholder="Correo" autoComplete="email" className="campo" required />
                <input name="clave" type="password" placeholder="Clave (mínimo 8 caracteres)" autoComplete="new-password" className="campo" required />
                <input name="colegio" placeholder="Colegio (opcional)" className="campo" />
                {estado?.error && <p className="mensaje-error">{estado.error}</p>}
                <p className="text-sm text-gris">
                    Al crear tu cuenta aceptas la{" "}
                    <Link href="/privacidad" className="font-extrabold text-azul">
                        política de privacidad
                    </Link>
                    .
                </p>
                <button disabled={pendiente} className="boton boton-ancho">
                    {pendiente ? "Creando..." : "Registrarme"}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gris">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="font-extrabold text-azul">
                    Inicia sesión
                </Link>
            </p>
        </main>
    );
}