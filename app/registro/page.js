"use client";

import Link from "next/link";
import { useActionState } from "react";
import Campo from "../../components/Campo";
import Requisitos from "../../components/Requisitos";
import { useCampos } from "../../lib/useCampos";
import {
    REGLAS,
    requisitosClave,
    requisitosUsuario,
    validarClave,
    validarColegio,
    validarCorreo,
    validarNombre,
    validarUsuario,
} from "../../lib/validaciones";
import { registrar } from "./actions";

export default function Registro() {
    const [estado, accion, pendiente] = useActionState(registrar, null);

    const { valores, enfocado, propsDe, alEnviar } = useCampos(
        { usuario: "", nombre: "", apellido: "", correo: "", clave: "", colegio: "" },
        (v) => ({
            usuario: validarUsuario(v.usuario),
            nombre: validarNombre(v.nombre, "nombre"),
            apellido: validarNombre(v.apellido, "apellido"),
            correo: validarCorreo(v.correo),
            clave: validarClave(v.clave, v.usuario),
            colegio: validarColegio(v.colegio),
        })
    );

    function errorServidor(campo, valor) {
        const mensaje = estado?.errores?.[campo];
        return mensaje && estado.enviado?.[campo] === valor ? mensaje : null;
    }

    return (
        <main className="mx-auto max-w-sm p-6">
            <h1 className="mb-6 text-center text-2xl font-extrabold">Crear cuenta</h1>

            <form
                action={accion}
                onSubmit={alEnviar}
                noValidate
                className="flex flex-col gap-4"
            >
                <Campo
                    etiqueta="Usuario"
                    {...propsDe("usuario", (v) => v.toLowerCase(), errorServidor)}
                    maxLength={REGLAS.usuario.max}
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                >
                    <Requisitos
                        items={requisitosUsuario(valores.usuario)}
                        visible={enfocado === "usuario" || valores.usuario.length > 0}
                    />
                </Campo>

                <div className="grid grid-cols-2 gap-3">
                    <Campo
                        etiqueta="Nombre"
                        {...propsDe("nombre")}
                        maxLength={REGLAS.nombre.max}
                        autoComplete="given-name"
                    />
                    <Campo
                        etiqueta="Apellido"
                        {...propsDe("apellido")}
                        maxLength={REGLAS.nombre.max}
                        autoComplete="family-name"
                    />
                </div>

                <Campo
                    etiqueta="Correo"
                    type="email"
                    {...propsDe("correo", null, errorServidor)}
                    maxLength={REGLAS.correo.max}
                    autoComplete="email"
                    autoCapitalize="none"
                    inputMode="email"
                    spellCheck={false}
                    ayuda="Debe tener @ y un dominio, por ejemplo nombre@gmail.com"
                />

                <Campo
                    etiqueta="Clave"
                    type="password"
                    {...propsDe("clave")}
                    maxLength={REGLAS.clave.max}
                    autoComplete="new-password"
                    autoCapitalize="none"
                >
                    <Requisitos
                        items={requisitosClave(valores.clave)}
                        visible={enfocado === "clave" || valores.clave.length > 0}
                    />
                </Campo>

                <Campo
                    etiqueta="Colegio"
                    {...propsDe("colegio")}
                    maxLength={REGLAS.colegio.max}
                    requerido={false}
                />

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