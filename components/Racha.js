"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Flame } from "lucide-react";

const nombresMeses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
];
const nombresDias = ["L", "M", "M", "J", "V", "S", "D"];

function claveFecha(anio, mes, dia) {
    return (
        String(anio).padStart(4, "0") +
        "-" +
        String(mes + 1).padStart(2, "0") +
        "-" +
        String(dia).padStart(2, "0")
    );
}

function fechaDesdeClave(clave) {
    const [anio, mes] = clave.split("-").map(Number);
    return { anio, mes: mes - 1 };
}

export default function Racha({ actual, mejor, respondioHoy, diasActivos, hoy }) {
    const [abierta, setAbierta] = useState(false);
    const fechaHoy = fechaDesdeClave(hoy);
    const [mes, setMes] = useState(fechaHoy.mes);
    const [anio, setAnio] = useState(fechaHoy.anio);
    const dias = new Set(diasActivos);
    const primerDia = new Date(Date.UTC(anio, mes, 1)).getUTCDay();
    const desplazamiento = (primerDia + 6) % 7;
    const totalDias = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate();
    const celdas = Array.from({ length: desplazamiento + totalDias }, (_, indice) => {
        const dia = indice - desplazamiento + 1;
        return dia > 0 ? dia : null;
    });
    const mesActual = anio === fechaHoy.anio && mes === fechaHoy.mes;

    function cambiarMes(direccion) {
        const siguiente = new Date(Date.UTC(anio, mes + direccion, 1));
        if (siguiente > new Date(Date.UTC(fechaHoy.anio, fechaHoy.mes, 1))) return;
        setAnio(siguiente.getUTCFullYear());
        setMes(siguiente.getUTCMonth());
    }

    return (
        <div className="tarjeta mb-6">
            <button
                type="button"
                onClick={() => setAbierta((valor) => !valor)}
                aria-expanded={abierta}
                className="flex w-full items-center gap-3 text-left"
            >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amarillo-claro text-amarillo-oscuro">
                    <Flame size={24} strokeWidth={2.5} />
                </span>
                <span className="flex-1">
                    <span className="block font-extrabold">Tu racha</span>
                    <span className="block text-sm text-gris">
                        {respondioHoy
                            ? "Sigue así, hoy ya practicaste."
                            : "Responde hoy para mantenerla."}
                    </span>
                </span>
                <span className="text-right">
                    <span className="block text-xl font-extrabold text-amarillo-oscuro">
                        {actual} {actual === 1 ? "día" : "días"}
                    </span>
                    <span className="block text-xs font-extrabold uppercase tracking-wide text-gris">
                        Mejor: {mejor}
                    </span>
                </span>
                <ChevronDown
                    size={20}
                    strokeWidth={3}
                    className={
                        "shrink-0 text-gris transition-transform duration-300 " +
                        (abierta ? "rotate-180" : "")
                    }
                />
            </button>

            <div
                className={
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none " +
                    (abierta
                        ? "mt-4 grid-rows-[1fr] border-t-2 border-borde pt-4 opacity-100"
                        : "grid-rows-[0fr] opacity-0")
                }
                aria-hidden={!abierta}
            >
                <div className="min-h-0 overflow-hidden" inert={!abierta}>
                <div className="mb-3 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={() => cambiarMes(-1)}
                        className="rounded-full p-1 text-gris hover:bg-superficie disabled:opacity-40"
                        aria-label="Mes anterior"
                        disabled={anio === 1}
                    >
                        <ChevronLeft size={22} strokeWidth={3} />
                    </button>
                    <h3 className="font-extrabold capitalize">
                        {nombresMeses[mes]} {anio}
                    </h3>
                    <button
                        type="button"
                        onClick={() => cambiarMes(1)}
                        className="rounded-full p-1 text-gris hover:bg-superficie disabled:opacity-40"
                        aria-label="Mes siguiente"
                        disabled={mesActual}
                    >
                        <ChevronRight size={22} strokeWidth={3} />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-extrabold text-gris">
                    {nombresDias.map((dia, indice) => (
                        <span key={indice} className="py-1">
                            {dia}
                        </span>
                    ))}
                </div>
                <div
                    key={anio + "-" + mes}
                    className="animar-entrada grid grid-cols-7 gap-1 text-center"
                >
                    {celdas.map((dia, indice) => {
                        if (!dia) return <span key={"vacio-" + indice} />;
                        const clave = claveFecha(anio, mes, dia);
                        const activo = dias.has(clave);
                        const esHoy = clave === hoy;
                        return (
                            <span
                                key={clave}
                                className={
                                    "relative flex h-9 items-center justify-center rounded-full text-sm " +
                                    (activo ? "font-extrabold text-texto" : "text-texto") +
                                    (esHoy ? " bg-superficie ring-2 ring-amarillo-oscuro" : "")
                                }
                                title={activo ? "Día practicado" : undefined}
                            >
                                {dia}
                                {activo && (
                                    <span
                                        aria-hidden="true"
                                        className="absolute bottom-1 h-1 w-1 rounded-full bg-amarillo-oscuro"
                                    />
                                )}
                            </span>
                        );
                    })}
                </div>
                <p className="mt-3 text-center text-xs text-gris">
                    Los días resaltados son los días en que respondiste preguntas.
                </p>
                </div>
            </div>
        </div>
    );
}
