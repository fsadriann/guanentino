"use client";

import { useActionState, useEffect, useState } from "react";
import Hoja from "../../../components/Hoja";
import { restablecerClave } from "./actions";

export default function Reiniciar({ usuarioId, nombre }) {
    const [abierto, setAbierto] = useState(false);
    const [estado, accion, pendiente] = useActionState(restablecerClave, null);

    useEffect(() => {
        if (estado) setAbierto(false);
    }, [estado]);

    return (
        <div className="flex flex-wrap items-center gap-3">
            <button
                type="button"
                onClick={() => setAbierto(true)}
                className="boton boton-secundario px-4 py-2 text-xs"
            >
                Restablecer clave
            </button>
            {estado?.clave && (
                <span className="mensaje-ok font-mono">{estado.clave}</span>
            )}
            {estado?.error && <span className="mensaje-error">{estado.error}</span>}

            <Hoja
                abierto={abierto}
                onCerrar={() => setAbierto(false)}
                titulo="¿Restablecer la clave?"
            >
                <p className="text-gris">
                    Se creará una clave temporal para{" "}
                    <span className="font-extrabold text-texto">{nombre}</span>. Su clave
                    actual dejará de funcionar y tendrá que crear una nueva al entrar.
                </p>
                <form action={accion} className="mt-5 flex flex-col gap-3">
                    <input type="hidden" name="usuarioId" value={usuarioId} />
                    <button disabled={pendiente} className="boton boton-ancho">
                        {pendiente ? "Restableciendo..." : "Sí, restablecer"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setAbierto(false)}
                        className="boton boton-secundario boton-ancho"
                    >
                        Cancelar
                    </button>
                </form>
            </Hoja>
        </div>
    );
}