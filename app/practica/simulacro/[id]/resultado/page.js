import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { X } from "lucide-react";
import { exigirSesion } from "../../../../../lib/permisos";
import { estiloArea } from "../../../../../lib/areas";
import { obtenerSimulacro } from "../../../../../services/simulacros";

const CHIP = {
    ok: "bg-acierto-claro text-acierto-oscuro",
    mal: "bg-rojo-claro text-rojo-oscuro",
    sin: "bg-superficie text-gris",
};
const NOMBRE = { ok: "correcta", mal: "incorrecta", sin: "sin responder" };

function duracion(ms) {
    const total = Math.max(0, Math.round(ms / 1000));
    const min = Math.floor(total / 60);
    const seg = total % 60;
    return min + ":" + String(seg).padStart(2, "0");
}

export default async function ResultadoSimulacro({ params }) {
    const sesion = await exigirSesion();
    const { id } = await params;
    const simulacroId = Number(id);
    if (!Number.isInteger(simulacroId)) notFound();

    const simulacro = await obtenerSimulacro(
        simulacroId,
        Number(sesion.user.id)
    );
    if (!simulacro) notFound();
    if (!simulacro.terminado) redirect("/practica/simulacro/" + simulacroId);

    const estados = simulacro.preguntas.map((sp) => {
        if (sp.opcionId === null) return "sin";
        const opcion = sp.pregunta.opciones.find((o) => o.id === sp.opcionId);
        return opcion?.esCorrecta ? "ok" : "mal";
    });
    const total = estados.length;
    const aciertos = estados.filter((e) => e === "ok").length;
    const incorrectas = estados.filter((e) => e === "mal").length;
    const sinResponder = total - aciertos - incorrectas;
    const porcentaje = total > 0 ? Math.round((aciertos / total) * 100) : 0;

    const porArea = new Map();
    simulacro.preguntas.forEach((sp, i) => {
        const area = sp.pregunta.area;
        const dato = porArea.get(area.id) ?? { area, total: 0, correctas: 0 };
        dato.total += 1;
        if (estados[i] === "ok") dato.correctas += 1;
        porArea.set(area.id, dato);
    });
    const areas = [...porArea.values()].sort((a, b) => a.area.id - b.area.id);

    const inicio = simulacro.inicio.getTime();
    const fin = simulacro.fin.getTime();
    const usado = Math.min(simulacro.terminado.getTime(), fin) - inicio;
    const minutos = Math.round((fin - inicio) / 60000);

    const mensaje =
        porcentaje >= 80
            ? "¡Muy bien!"
            : porcentaje >= 50
                ? "Buen intento"
                : "Sigue practicando";

    const bannerClase =
        porcentaje >= 80
            ? "bg-acierto-claro text-acierto-oscuro"
            : porcentaje >= 50
              ? "bg-amarillo/20 text-amarillo-oscuro"
              : "bg-rojo-claro text-rojo-oscuro";

    return (
        <main className="mx-auto max-w-xl p-6">
            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/practica"
                    aria-label="Volver a la práctica"
                    className="text-gris hover:text-texto"
                >
                    <X size={26} strokeWidth={3} />
                </Link>
                <span className="text-sm font-extrabold text-gris">Simulacro</span>
            </div>

            <div className={"animar-entrada mb-4 rounded-2xl p-5 text-center " + bannerClase}>
                <p className="text-xl font-extrabold">{mensaje}</p>
                <p className="text-5xl font-extrabold">{porcentaje}%</p>
                <p className="font-extrabold">
                    {aciertos} de {total} correctas
                </p>
            </div>

            <div className="animar-lista grid grid-cols-3 gap-3">
                <div className="tarjeta text-center">
                    <p className="text-2xl font-extrabold text-acierto-oscuro">
                        {aciertos}
                    </p>
                    <p className="text-xs font-extrabold text-gris">Correctas</p>
                </div>
                <div className="tarjeta text-center">
                    <p className="text-2xl font-extrabold text-rojo-oscuro">
                        {incorrectas}
                    </p>
                    <p className="text-xs font-extrabold text-gris">Incorrectas</p>
                </div>
                <div className="tarjeta text-center">
                    <p className="text-2xl font-extrabold text-gris">{sinResponder}</p>
                    <p className="text-xs font-extrabold text-gris">Sin responder</p>
                </div>
            </div>

            <p className="mt-4 text-center text-sm font-extrabold text-gris">
                Tiempo: {duracion(usado)} de {minutos} minutos
            </p>

            <div className="tarjeta mt-4">
                <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-gris">
                    Por área
                </p>
                <div className="flex flex-col gap-3">
                    {areas.map(({ area, total: cantidad, correctas }) => {
                        const estilo = estiloArea(area.nombre);
                        const Icono = estilo.Icono;
                        return (
                            <div key={area.id} className="flex items-center gap-3">
                                <span
                                    className={
                                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-b-4 text-white " +
                                        estilo.circulo
                                    }
                                >
                                    <Icono size={20} strokeWidth={2.5} />
                                </span>
                                <span className="flex-1 font-extrabold">
                                    {area.nombre}
                                </span>
                                <span className="font-extrabold text-gris">
                                    {correctas} de {cantidad}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="tarjeta mt-4">
                <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-gris">
                    Tus respuestas
                </p>
                <div className="flex flex-wrap gap-2">
                    {estados.map((e, i) => (
                        <span
                            key={i}
                            role="img"
                            aria-label={"Pregunta " + (i + 1) + " " + NOMBRE[e]}
                            title={"Pregunta " + (i + 1) + " " + NOMBRE[e]}
                            className={
                                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold " +
                                CHIP[e]
                            }
                        >
                            {i + 1}
                        </span>
                    ))}
                </div>
            </div>

            <div className="sticky bottom-0 -mx-6 mt-4 flex flex-col gap-2 border-t-2 border-borde bg-fondo p-4">
                <Link href="/practica/simulacro" className="boton boton-azul boton-ancho">
                    Hacer otro simulacro
                </Link>
                <div className="grid grid-cols-2 gap-2">
                    <Link href="/progreso" className="boton boton-secundario boton-ancho">
                        Ver progreso
                    </Link>
                    <Link href="/practica" className="boton boton-secundario boton-ancho">
                        Terminar
                    </Link>
                </div>
            </div>
        </main>
    );
}