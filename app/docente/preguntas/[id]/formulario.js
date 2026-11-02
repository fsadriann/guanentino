"use client";

import { useActionState } from "react";
import CampoImagen from "../../../../components/CampoImagen";
import VistaPrevia from "../../../../components/VistaPrevia";
import { editarPregunta } from "./actions";

const EJEMPLO = "$$\\frac{3}{4}$$";

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

            <CampoImagen
                actualId={pregunta.imagenId}
                actualAlt={pregunta.imagenAlt ?? ""}
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

            <p className="text-sm text-gris">
                Para escribir una fórmula ponla entre dos signos de dólar, por ejemplo{" "}
                <code className="font-mono">{EJEMPLO}</code>.
            </p>

            <VistaPrevia />

            {estado?.error && <p className="mensaje-error">{estado.error}</p>}
            {estado?.ok && <p className="mensaje-ok">{estado.ok}</p>}

            <button disabled={pendiente} className="boton boton-ancho">
                {pendiente ? "Guardando..." : "Guardar cambios"}
            </button>
        </form>
    );
}