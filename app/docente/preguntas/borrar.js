"use client";

import { useState } from "react";
import Hoja from "../../../components/Hoja";
import { borrarPregunta } from "./actions";

export default function Borrar({ preguntaId }) {
    const [abierto, setAbierto] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setAbierto(true)}
                className="text-sm font-extrabold text-rojo"
            >
                Borrar
            </button>

            <Hoja
                abierto={abierto}
                onCerrar={() => setAbierto(false)}
                titulo="¿Borrar esta pregunta?"
            >
                <p className="text-gris">Esta acción no se puede deshacer.</p>
                <form action={borrarPregunta} className="mt-5 flex flex-col gap-3">
                    <input type="hidden" name="preguntaId" value={preguntaId} />
                    <button className="boton boton-rojo boton-ancho">Sí, borrar</button>
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