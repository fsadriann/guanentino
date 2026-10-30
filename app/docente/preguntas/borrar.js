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
                className="text-sm text-red-600 underline"
            >
                Borrar
            </button>
        </form>
    );
}