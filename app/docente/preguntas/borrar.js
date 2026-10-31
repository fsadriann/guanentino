"use client";

import { borrarPregunta } from "./actions";

export default function Borrar({ preguntaId }) {
    return (
        <form action={borrarPregunta}>
            <input type="hidden" name="preguntaId" value={preguntaId} />
            <button
                onClick={(e) => {
                    if (!confirm("¿Borrar esta pregunta?")) e.preventDefault();
                }}
                className="text-sm font-extrabold text-rojo"
            >
                Borrar
            </button>
        </form>
    );
}