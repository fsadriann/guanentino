"use client";

import { useEffect, useState } from "react";
import {
    CalendarDays,
    Dumbbell,
    Flame,
    Sparkles,
    Trophy,
    X,
    ChevronRight,
    ChevronLeft,
} from "lucide-react";

const PASOS = [
    {
        Icono: CalendarDays,
        titulo: "Preguntas del día",
        colorFondo: "bg-relleno-primario",
        descripcion:
            "Cada día tienes 5 preguntas (una por área). Respóndelas para asegurar tus puntos del día y mantener activa tu racha.",
    },
    {
        Icono: Dumbbell,
        titulo: "Práctica libre & Simulacro",
        colorFondo: "bg-relleno-azul",
        descripcion:
            "Repasa preguntas de días anteriores a tu propio ritmo o ponte a prueba con un simulacro contra reloj con todas las áreas.",
    },
    {
        Icono: Flame,
        titulo: "Progreso y Racha",
        colorFondo: "bg-relleno-naranja",
        descripcion:
            "Sigue tu constancia diaria, conoce tu porcentaje de aciertos e identifica cuál es tu área más débil para mejorarla.",
    },
    {
        Icono: Trophy,
        titulo: "Ranking semanal",
        colorFondo: "bg-relleno-rosa",
        descripcion:
            "Compite de forma amistosa con tus compañeros. Cada semana se reinicia la tabla de posiciones con los mejores estudiantes.",
    },
];

export default function TutorialModal() {
    const [abierto, setAbierto] = useState(false);
    const [paso, setPaso] = useState(0);

    useEffect(() => {
        try {
            const visto = localStorage.getItem("tutorial_visto");
            if (!visto) {
                // Programar tras el mount para evitar sincronía directa en el efecto
                const timer = setTimeout(() => setAbierto(true), 50);
                return () => clearTimeout(timer);
            }
        } catch {}

        function abrirManual() {
            setPaso(0);
            setAbierto(true);
        }

        window.addEventListener("abrir-tutorial", abrirManual);
        return () => window.removeEventListener("abrir-tutorial", abrirManual);
    }, []);

    function cerrar() {
        setAbierto(false);
        try {
            localStorage.setItem("tutorial_visto", "true");
        } catch {}
    }

    function siguiente() {
        if (paso < PASOS.length - 1) {
            setPaso(paso + 1);
        } else {
            cerrar();
        }
    }

    function anterior() {
        if (paso > 0) {
            setPaso(paso - 1);
        }
    }

    if (!abierto) return null;

    const actual = PASOS[paso];
    const IconoPaso = actual.Icono;
    const esUltimo = paso === PASOS.length - 1;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-tutorial"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animar-entrada"
        >
            <div className="tarjeta relative flex w-full max-w-md flex-col overflow-hidden bg-fondo p-6 text-center shadow-xl">
                {/* Botón cerrar / saltar */}
                <button
                    type="button"
                    onClick={cerrar}
                    aria-label="Cerrar tutorial"
                    className="absolute right-4 top-4 text-gris hover:text-texto"
                >
                    <X size={22} strokeWidth={2.5} />
                </button>

                {/* Ícono central con animación */}
                <div className="mx-auto mb-4 flex items-center justify-center">
                    <span
                        key={actual.titulo}
                        className={
                            "flex h-20 w-20 items-center justify-center rounded-3xl border-b-4 border-black/25 text-white animar-rebote " +
                            actual.colorFondo
                        }
                    >
                        <IconoPaso size={38} strokeWidth={2.5} />
                    </span>
                </div>

                {/* Indicadores de pasos */}
                <div className="mb-4 flex justify-center gap-1.5">
                    {PASOS.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setPaso(i)}
                            aria-label={`Ir al paso ${i + 1}`}
                            className={
                                "h-2 rounded-full transition-all duration-300 " +
                                (i === paso
                                    ? "w-7 bg-azul"
                                    : "w-2 bg-borde hover:bg-gris")
                            }
                        />
                    ))}
                </div>

                {/* Contenido del paso actual */}
                <div key={paso} className="animar-entrada min-h-[110px]">
                    <h2
                        id="titulo-tutorial"
                        className="mb-2 text-xl font-extrabold text-texto"
                    >
                        {actual.titulo}
                    </h2>
                    <p className="text-sm font-semibold leading-relaxed text-gris">
                        {actual.descripcion}
                    </p>
                </div>

                {/* Acciones */}
                <div className="mt-6 flex items-center gap-2">
                    {paso > 0 ? (
                        <button
                            type="button"
                            onClick={anterior}
                            className="boton boton-secundario shrink-0 px-3"
                            aria-label="Paso anterior"
                        >
                            <ChevronLeft size={20} strokeWidth={2.5} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={cerrar}
                            className="text-sm font-bold text-gris hover:text-texto px-2"
                        >
                            Saltar
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={siguiente}
                        className="boton boton-azul flex-1 gap-1"
                    >
                        <span>{esUltimo ? "¡Empezar a practicar!" : "Siguiente"}</span>
                        {!esUltimo && <ChevronRight size={18} strokeWidth={2.5} />}
                    </button>
                </div>
            </div>
        </div>
    );
}

