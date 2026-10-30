"use client";

import { useActionState } from "react";
import { editarPregunta } from "./actions";

export default function Formulario({ pregunta, areas, bloqueada }) {
    const [estado, accion, pendiente] = useActionState(editarPregunta, null);
    const correctaActual = pregunta.opciones.findIndex((o) => o.esCorrecta);

    return (
        <form action={accion} className="flex flex-col gap-3">
            <input type="hidden" name="id" value={pregunta.id} />

            <select name="areaId" defaultValue={pregunta.areaId} className="rounded border p-2">
                {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                        {a.nombre}
                    </option>
                ))}
            </select>

            <textarea name="enunciado" defaultValue={pregunta.enunciado} className="rounded border p-2" rows={3} required />

            {pregunta.opciones.map((o, i) => (
                <label key={o.id} className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="correcta"
                        value={i}
                        defaultChecked={i === correctaActual}
                        disabled={bloqueada && i !== correctaActual}
                    />
                    <input name={"opcion" + i} defaultValue={o.texto} className="flex-1 rounded border p-2" required />
                </label>
            ))}

            {bloqueada ? (
                <p className="text-sm opacity-70">
                    Esta pregunta ya tiene respuestas. Puedes corregir los textos pero no la opción correcta.
                </p>
            ) : (
                <p className="text-sm opacity-70">Marca el círculo de la opción correcta.</p>
            )}

            <textarea name="explicacion" defaultValue={pregunta.explicacion} className="rounded border p-2" rows={3} required />

            {estado?.error && <p className="text-red-600">{estado.error}</p>}
            {estado?.ok && <p className="text-green-600">{estado.ok}</p>}

            <button disabled={pendiente} className="rounded bg-blue-600 p-2 text-white">
                {pendiente ? "Guardando..." : "Guardar cambios"}
            </button>
        </form>
    );
}