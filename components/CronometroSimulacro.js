"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { finalizarSimulacro } from "../app/practica/simulacro/actions";

function formatear(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const min = Math.floor(total / 60);
    const seg = total % 60;
    return min + ":" + String(seg).padStart(2, "0");
}

export default function CronometroSimulacro({ simulacroId, restanteMs }) {
    const [restante, setRestante] = useState(restanteMs);
    const [, empezar] = useTransition();
    const terminando = useRef(false);

    useEffect(() => {
        const finLocal = Date.now() + restanteMs;
        const reloj = setInterval(() => {
            const queda = finLocal - Date.now();
            setRestante(queda);
            if (queda <= 0) {
                clearInterval(reloj);
                if (!terminando.current) {
                    terminando.current = true;
                    empezar(async () => {
                        await finalizarSimulacro(simulacroId);
                    });
                }
            }
        }, 500);
        return () => clearInterval(reloj);
    }, [restanteMs, simulacroId]);

    const poco = restante <= 5 * 60 * 1000;
    const muyPoco = restante <= 60 * 1000;

    return (
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
    );
}