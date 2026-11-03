"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import BarraProgreso from "./BarraProgreso";
import {
    finalizarSimulacro,
    responderSimulacro,
} from "../app/practica/simulacro/actions";

function formatear(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const min = Math.floor(total / 60);
    const seg = total % 60;
    return min + ":" + String(seg).padStart(2, "0");
}

function primeraPendiente(preguntas) {
    const i = preguntas.findIndex((p) => p.elegida === null);
    return i === -1 ? preguntas.length - 1 : i;
}

export default function SimulacroLeccion({ simulacroId, restanteMs, preguntas }) {
    const router = useRouter();
    const [inicio] = useState(() => primeraPendiente(preguntas));
    const [indice, setIndice] = useState(inicio);
    const [barra, setBarra] = useState({ desde: inicio, hechas: inicio });
    const [elegidas, setElegidas] = useState(() =>
        Object.fromEntries(preguntas.map((p) => [p.id, p.elegida]))
    );
    const [restante, setRestante] = useState(restanteMs);
    const [confirmando, setConfirmando] = useState(false);
    const [pendiente, empezar] = useTransition();
    const terminando = useRef(false);

    const terminar = useCallback(() => {
        if (terminando.current) return;
        terminando.current = true;
        empezar(async () => {
            await finalizarSimulacro(simulacroId);
        });
    }, [simulacroId, empezar]);

    useEffect(() => {
        const finLocal = Date.now() + restanteMs;
        const reloj = setInterval(() => {
            const queda = finLocal - Date.now();
            setRestante(queda);
            if (queda <= 0) {
                clearInterval(reloj);
                terminar();
            }
        }, 500);
        return () => clearInterval(reloj);
    }, [restanteMs, terminar]);

    function ir(nuevo) {
        setIndice(nuevo);
        setConfirmando(false);
        if (nuevo > barra.hechas) {
            setBarra({ desde: barra.hechas, hechas: nuevo });
        }
    }

    function elegir(preguntaId, opcionId) {
        if (terminando.current) return;
        setElegidas((previas) => ({ ...previas, [preguntaId]: opcionId }));
        setConfirmando(false);
        responderSimulacro(simulacroId, preguntaId, opcionId)
            .then((ok) => {
                if (!ok) router.refresh();
            })
            .catch(() => router.refresh());
    }

    const actual = preguntas[indice];
    const respondidas = Object.values(elegidas).filter((v) => v !== null).length;
    const faltan = preguntas.length - respondidas;
    const ultima = indice === preguntas.length - 1;
    const poco = restante <= 5 * 60 * 1000;
    const muyPoco = restante <= 60 * 1000;

    return (
        <main className="mx-auto max-w-xl p-6">
            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/practica"
                    aria-label="Salir del simulacro. El tiempo sigue corriendo"
                    className="text-gris hover:text-texto"
                >
                    <X size={26} strokeWidth={3} />
                </Link>
                <span className="text-sm font-extrabold text-gris">Simulacro</span>
                <span
                    role="timer"
                    aria-label="Tiempo restante"
                    className={
                        "ml-auto text-lg font-extrabold tabular-nums " +
                        (muyPoco
                            ? "text-rojo"
                            : poco
                              ? "text-amarillo-oscuro"
                              : "text-gris")
                    }
                >
                    {formatear(restante)}
                </span>
            </div>

            <BarraProgreso
                key={barra.hechas}
                hechas={barra.hechas}
                desde={barra.desde}
                total={preguntas.length}
                etiqueta="Progreso del simulacro"
            />

            <div key={actual.id} className="animar-entrada">
                {actual.contenido}

                <div role="radiogroup" className="flex flex-col gap-3">
                    {actual.opciones.map((o) => {
                        const marcada = elegidas[actual.id] === o.id;
                        return (
                            <button
                                key={o.id}
                                type="button"
                                role="radio"
                                aria-checked={marcada}
                                onClick={() => elegir(actual.id, o.id)}
                                className={
                                    "tarjeta w-full text-left font-extrabold " +
                                    (marcada
                                        ? "border-azul bg-azul-claro text-azul-oscuro"
                                        : "hover:bg-superficie")
                                }
                            >
                                <span dangerouslySetInnerHTML={{ __html: o.html }} />
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="sticky bottom-0 -mx-6 mt-6 flex flex-col gap-2 border-t-2 border-borde bg-fondo p-4">
                {confirmando && (
                    <p className="mensaje-error">
                        Te faltan {faltan} sin responder. Si terminas ahora
                        cuentan como incorrectas.
                    </p>
                )}
                <div className="flex gap-2">
                    {indice > 0 && (
                        <button
                            type="button"
                            className="boton boton-secundario"
                            onClick={() => ir(indice - 1)}
                        >
                            Anterior
                        </button>
                    )}
                    {ultima ? (
                        <button
                            type="button"
                            disabled={pendiente}
                            className="boton boton-acierto flex-1"
                            onClick={() => {
                                if (faltan > 0 && !confirmando) setConfirmando(true);
                                else terminar();
                            }}
                        >
                            {confirmando ? "Terminar de todas formas" : "Terminar"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="boton flex-1"
                            onClick={() => ir(indice + 1)}
                        >
                            {elegidas[actual.id] ? "Siguiente" : "Saltar"}
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}