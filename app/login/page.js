"use client";

import Link from "next/link";
import { useActionState } from "react";
import Campo from "../../components/Campo";
import { useCampos } from "../../lib/useCampos";
import { iniciarSesion } from "./actions";

export default function Login() {
    const [estado, accion, pendiente] = useActionState(iniciarSesion, null);

    const { propsDe, alEnviar } = useCampos(
        { usuario: "", clave: "" },
        (v) => ({
            usuario: v.usuario.trim() ? null : "Escribe tu usuario",
            clave: v.clave ? null : "Escribe tu clave",
        })
    );

    return (
        <main className="mx-auto max-w-sm p-6">
            <h1 className="mb-6 text-center text-2xl font-extrabold">Iniciar sesión</h1>

            <form
                action={accion}
                onSubmit={alEnviar}
                noValidate
                className="flex flex-col gap-4"
            >
                <Campo
                    etiqueta="Usuario"
                    {...propsDe("usuario")}
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                />
                <Campo
                    etiqueta="Clave"
                    type="password"
                    {...propsDe("clave")}
                    autoComplete="current-password"
                    autoCapitalize="none"
                />

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