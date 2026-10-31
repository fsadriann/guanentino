"use client";

import { useActionState } from "react";
import { editarPregunta } from "./actions";

export default function Formulario({ pregunta, areas, bloqueada }) {
    const [estado, accion, pendiente] = useActionState(editarPregunta, null);
    const correctaActual = pregunta.opciones.findIndex((o) => o.esCorrecta);

    return (
        <form action={accion} className="flex flex-col gap-3">
            <input type="hidden" name="id" value={pregunta.id} />

            <select name="areaId" defaultValue={pregunta.areaId} className="campo">
                {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                        {a.nombre}
                    </option>
                ))}
            </select>

            <textarea
                name="enunciado"
                defaultValue={pregunta.enunciado}
                className="campo"
                rows={5}
                required
            />

            {pregunta.opciones.map((o, i) => (
                <label key={o.id} className="flex items-center gap-3">
                    <input
                        type="radio"
                        name="correcta"
                        value={i}
                        defaultChecked={i === correctaActual}
                        disabled={bloqueada && i !== correctaActual}
                        className="h-5 w-5 shrink-0 accent-primario disabled:opacity-40"
                    />
                    <input
                        name={"opcion" + i}
                        defaultValue={o.texto}
                        className="campo"
                        required
                    />
                </label>
            ))}

            {bloqueada ? (
                <p className="tarjeta border-amarillo text-sm">
                    Esta pregunta ya tiene respuestas. Puedes corregir los textos pero no
                    la opción correcta.
                </p>
            ) : (
                <p className="text-sm text-gris">Marca el círculo de la opción correcta.</p>
            )}

            <textarea
                name="explicacion"
                defaultValue={pregunta.explicacion}
                className="campo"
                rows={3}
                required
            />

            {estado?.error && <p className="mensaje-error">{estado.error}</p>}
            {estado?.ok && <p className="mensaje-ok">{estado.ok}</p>}

            <button disabled={pendiente} className="boton boton-ancho">
                {pendiente ? "Guardando..." : "Guardar cambios"}
            </button>
        </form>
    );
}