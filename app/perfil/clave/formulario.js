"use client";

import Link from "next/link";
import { useActionState } from "react";
import Campo from "../../../components/Campo";
import Requisitos from "../../../components/Requisitos";
import { useCampos } from "../../../lib/useCampos";
import {
    REGLAS,
    requisitosClave,
    validarClave,
} from "../../../lib/validaciones";
import { cambiarClave } from "./actions";

export default function Formulario() {
    const [estado, accion, pendiente] = useActionState(cambiarClave, null);

    const { valores, enfocado, propsDe, alEnviar } = useCampos(
        { actual: "", nueva: "", repetir: "" },
        (v) => ({
            actual: v.actual ? null : "Escribe tu clave actual",
            nueva: validarClave(v.nueva),
            repetir: !v.repetir
                ? "Repite la clave nueva"
                : v.repetir !== v.nueva
                    ? "Las claves no coinciden"
                    : null,
        })
    );

    return (
        <form
            action={accion}
            onSubmit={alEnviar}
            noValidate
            className="flex flex-col gap-4"
        >
            <Campo
                etiqueta="Clave actual"
                type="password"
                {...propsDe("actual")}
                autoComplete="current-password"
                autoCapitalize="none"
            />

            <Campo
                etiqueta="Clave nueva"
                type="password"
                {...propsDe("nueva")}
                maxLength={REGLAS.clave.max}
                autoComplete="new-password"
                autoCapitalize="none"
            >
                <Requisitos
                    items={requisitosClave(valores.nueva)}
                    visible={enfocado === "nueva" || valores.nueva.length > 0}
                />
            </Campo>

            <Campo
                etiqueta="Repite la clave nueva"
                type="password"
                {...propsDe("repetir")}
                maxLength={REGLAS.clave.max}
                autoComplete="new-password"
                autoCapitalize="none"
            />

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