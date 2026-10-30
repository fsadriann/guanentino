"use client";

import { useActionState } from "react";
import { crearPregunta } from "./actions";

export default function Formulario({ areas }) {
    const [estado, accion, pendiente] = useActionState(crearPregunta, null);

    return (
        <form action={accion} className="flex flex-col gap-3">
            <select name="areaId" className="rounded border p-2" required>
                {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                        {a.nombre}
                    </option>
                ))}
            </select>

            <textarea name="enunciado" placeholder="Enunciado de la pregunta" className="rounded border p-2" rows={3} required />

            {[0, 1, 2, 3].map((i) => (
                <label key={i} className="flex items-center gap-2">
                    <input type="radio" name="correcta" value={i} required />
                    <input name={"opcion" + i} placeholder={"Opción " + (i + 1)} className="flex-1 rounded border p-2" required />
                </label>
            ))}
            <p className="text-sm opacity-70">Marca el círculo de la opción correcta.</p>

            <textarea name="explicacion" placeholder="Explicación de la respuesta" className="rounded border p-2" rows={3} required />

            {estado?.error && <p className="text-red-600">{estado.error}</p>}
            {estado?.ok && <p className="text-green-600">{estado.ok}</p>}

            <button disabled={pendiente} className="rounded bg-blue-600 p-2 text-white">
                {pendiente ? "Guardando..." : "Guardar pregunta"}
            </button>
        </form>
    );
}