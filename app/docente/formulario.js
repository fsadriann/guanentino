"use client";

import { useActionState } from "react";
import CampoImagen from "../../components/CampoImagen";
import VistaPrevia from "../../components/VistaPrevia";
import { crearPregunta } from "./actions";

const EJEMPLO = "$$\\frac{3}{4}$$";

export default function Formulario({ areas }) {
    const [estado, accion, pendiente] = useActionState(crearPregunta, null);

    return (
        <form action={accion} className="flex flex-col gap-3">
            <select name="areaId" className="campo" required>
                {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                        {a.nombre}
                    </option>
                ))}
            </select>

            <textarea
                name="enunciado"
                placeholder="Enunciado de la pregunta"
                className="campo"
                rows={4}
                required
            />

            <CampoImagen />

            {[0, 1, 2, 3].map((i) => (
                <label key={i} className="flex items-center gap-3">
                    <input
                        type="radio"
                        name="correcta"
                        value={i}
                        required
                        className="h-5 w-5 shrink-0 accent-primario"
                    />
                    <input
                        name={"opcion" + i}
                        placeholder={"Opción " + "ABCD"[i]}
                        className="campo"
                        required
                    />
                </label>
            ))}
            <p className="text-sm text-gris">Marca el círculo de la opción correcta.</p>

            <textarea
                name="explicacion"
                placeholder="Explicación de la respuesta"
                className="campo"
                rows={3}
                required
            />

            <p className="text-sm text-gris">
                Para escribir una fórmula ponla entre dos signos de dólar, por ejemplo{" "}
                <code className="font-mono">{EJEMPLO}</code>. Si va sola en su renglón se
                muestra grande y centrada.
            </p>

            <VistaPrevia />

            {estado?.error && <p className="mensaje-error">{estado.error}</p>}
            {estado?.ok && <p className="mensaje-ok">{estado.ok}</p>}

            <button disabled={pendiente} className="boton boton-ancho">
                {pendiente ? "Guardando..." : "Guardar pregunta"}
            </button>
        </form>
    );
}