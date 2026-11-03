"use client";

import Link from "next/link";
import { useState } from "react";
import { Calculator, Check, X } from "lucide-react";

const OPCIONES = [
    { id: "a", texto: "$12.000", correcta: false },
    { id: "b", texto: "$15.000", correcta: true },
    { id: "c", texto: "$18.000", correcta: false },
    { id: "d", texto: "$27.000", correcta: false },
];

const EXPLICACION =
    "Cada cuaderno cuesta $9.000 dividido entre 3, o sea $3.000. Para 5 cuadernos se multiplica 5 por $3.000 y da $15.000.";

export default function PreguntaDemo() {
    const [seleccion, setSeleccion] = useState(null);
    const [comprobada, setComprobada] = useState(false);

    const elegida = OPCIONES.find((o) => o.id === seleccion);
    const acerto = comprobada && Boolean(elegida?.correcta);

    function reiniciar() {
        setSeleccion(null);
        setComprobada(false);
    }

    return (
        <div className="tarjeta p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-relleno-azul px-3 py-1 text-sm font-extrabold text-white">
                    <Calculator size={16} strokeWidth={2.5} /> Matemáticas
                </span>
                <span className="text-sm font-extrabold text-gris">Prueba una pregunta</span>
            </div>

            <p className="mb-4 text-lg font-extrabold">
                Si 3 cuadernos cuestan $9.000, ¿cuánto cuestan 5 cuadernos del mismo
                precio?
            </p>

            <fieldset disabled={comprobada} className="flex min-w-0 flex-col gap-2">
                <legend className="sr-only">Opciones de respuesta</legend>
                {OPCIONES.map((o, i) => {
                    const marcada = seleccion === o.id;

                    let estilo =
                        "peer-checked:border-azul peer-checked:bg-azul-claro peer-focus-visible:ring-2 peer-focus-visible:ring-azul";
                    if (comprobada) {
                        if (o.correcta) {
                            estilo =
                                "border-acierto bg-acierto-claro" + (acerto ? " animar-rebote" : "");
                        } else if (marcada) {
                            estilo = "border-rojo bg-rojo-claro animar-sacudida";
                        } else {
                            estilo = "opacity-60";
                        }
                    }

                    return (
                        <label key={o.id} className="cursor-pointer has-[:disabled]:cursor-default">
                            <input
                                type="radio"
                                name="demo"
                                value={o.id}
                                checked={marcada}
                                onChange={() => setSeleccion(o.id)}
                                className="peer sr-only"
                            />
                            <div className={"tarjeta flex items-center gap-3 py-3 " + estilo}>
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-borde bg-fondo text-sm font-extrabold text-gris">
                                    {"ABCD"[i]}
                                </span>
                                <span className="flex-1">{o.texto}</span>
                                {comprobada && o.correcta && (
                                    <Check size={20} strokeWidth={3} className="shrink-0 text-acierto-oscuro" />
                                )}
                                {comprobada && marcada && !o.correcta && (
                                    <X size={20} strokeWidth={3} className="shrink-0 text-rojo-oscuro" />
                                )}
                            </div>
                        </label>
                    );
                })}
            </fieldset>

            {comprobada && (
                <div
                    className={
                        "animar-entrada mt-4 rounded-2xl p-4 " +
                        (acerto
                            ? "bg-acierto-claro text-acierto-oscuro"
                            : "bg-rojo-claro text-rojo-oscuro")
                    }
                >
                    <p className="text-lg font-extrabold">
                        {acerto ? "¡Correcto! +10 puntos" : "Incorrecto"}
                    </p>
                    <p className="mt-1 text-sm">{EXPLICACION}</p>
                </div>
            )}

            {!comprobada ? (
                <button
                    type="button"
                    disabled={!seleccion}
                    onClick={() => setComprobada(true)}
                    className="boton boton-ancho mt-4"
                >
                    Comprobar
                </button>
            ) : (
                <div className="mt-4 flex flex-col gap-2">
                    <Link href="/registro" className="boton boton-ancho">
                        Crear mi cuenta
                    </Link>
                    <button
                        type="button"
                        onClick={reiniciar}
                        className="boton boton-secundario boton-ancho"
                    >
                        Probar otra vez
                    </button>
                </div>
            )}
        </div>
    );
}