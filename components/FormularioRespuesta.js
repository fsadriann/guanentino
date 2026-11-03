"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

function Contenido({ opciones, seleccion, setSeleccion, textoBoton }) {
    const { pending } = useFormStatus();

    return (
        <>
            <fieldset
                disabled={pending}
                className="animar-lista flex min-w-0 flex-col gap-3"
            >
                {opciones.map((o, i) => (
                    <label
                        key={o.id}
                        className="cursor-pointer has-[:disabled]:cursor-not-allowed"
                    >
                        <input
                            type="radio"
                            name="opcionId"
                            value={o.id}
                            checked={seleccion === o.id}
                            onChange={() => setSeleccion(o.id)}
                            className="peer sr-only"
                        />
                        <div className="tarjeta flex items-center gap-3 peer-checked:border-azul peer-checked:bg-azul-claro peer-focus-visible:ring-2 peer-focus-visible:ring-azul peer-disabled:opacity-70">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-borde text-sm font-extrabold text-gris">
                                {"ABCD"[i]}
                            </span>
                            <span
                                className="whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: o.html }}
                            />
                        </div>
                    </label>
                ))}
            </fieldset>

            <div className="sticky bottom-0 -mx-6 mt-4 border-t-2 border-borde bg-fondo p-4">
                <button
                    type="submit"
                    disabled={seleccion === null || pending}
                    className="boton boton-ancho"
                >
                    {pending ? "Comprobando..." : textoBoton}
                </button>
            </div>
        </>
    );
}

export default function FormularioRespuesta({
    accion,
    campos = {},
    opciones,
    textoBoton = "Comprobar",
}) {
    const [seleccion, setSeleccion] = useState(null);

    return (
        <form action={accion}>
            {Object.entries(campos).map(([nombre, valor]) => (
                <input key={nombre} type="hidden" name={nombre} value={valor} />
            ))}
            <Contenido
                opciones={opciones}
                seleccion={seleccion}
                setSeleccion={setSeleccion}
                textoBoton={textoBoton}
            />
        </form>
    );
}