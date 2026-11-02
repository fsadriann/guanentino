"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import Hoja from "./Hoja";

export default function CerrarSesion({ accion }) {
    const [abierto, setAbierto] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setAbierto(true)}
                className="boton boton-secundario boton-ancho gap-2 text-rojo"
            >
                <LogOut size={18} strokeWidth={2.5} /> Cerrar sesión
            </button>

            <Hoja
                abierto={abierto}
                onCerrar={() => setAbierto(false)}
                titulo="¿Cerrar sesión?"
            >
                <p className="text-gris">
                    Tendrás que escribir tu usuario y tu clave para volver a entrar.
                </p>
                <form action={accion} className="mt-5 flex flex-col gap-3">
                    <button className="boton boton-rojo boton-ancho">
                        Sí, cerrar sesión
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
        </>
    );
}