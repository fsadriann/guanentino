import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirSesion } from "../../../lib/permisos";
import { prisma } from "../../../lib/prisma";
import { estiloArea } from "../../../lib/areas";
import { separarEnunciado } from "../../../lib/enunciado";
import { preguntaDelDia } from "../../../services/preguntas";
import FormularioRespuesta from "./formulario-respuesta";

export default async function Pregunta({ params }) {
    const sesion = await exigirSesion();

    const { areaId } = await params;
    const id = Number(areaId);
    if (!Number.isInteger(id)) notFound();

    const area = await prisma.area.findUnique({ where: { id } });
    if (!area) notFound();

    const pregunta = await preguntaDelDia(id);
    if (!pregunta) {
        return (
            <main className="mx-auto max-w-xl p-6">
                <Link href="/pregunta" className="text-2xl font-extrabold text-gris">
                    ✕
                </Link>
                <div className="tarjeta mt-4 text-center">
                    Todavía no hay preguntas en {area.nombre}.
                </div>
            </main>
        );
    }

    const respuesta = await prisma.respuesta.findUnique({
        where: {
            usuarioId_preguntaId: {
                usuarioId: Number(sesion.user.id),
                preguntaId: pregunta.id,
            },
        },
    });

    const estilo = estiloArea(pregunta.area.nombre);
    const partes = separarEnunciado(pregunta.enunciado);

    return (
        <main className="mx-auto max-w-xl p-6">
            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/pregunta"
                    aria-label="Volver"
                    className="text-2xl font-extrabold text-gris hover:text-texto"
                >
                    ✕
                </Link>
                <span
                    className={
                        "rounded-full px-3 py-1 text-sm font-extrabold text-white " +
                        estilo.fondo
                    }
                >
                    {estilo.emoji} {pregunta.area.nombre}
                </span>
            </div>

            {partes.instruccion && (
                <p className="mb-2 text-sm font-extrabold uppercase tracking-wide text-gris">
                    {partes.instruccion}
                </p>
            )}

            {partes.texto && (
                <div className="tarjeta mb-4 whitespace-pre-line bg-superficie leading-relaxed">
                    {partes.texto}
                </div>
            )}

            <h1 className="mb-6 whitespace-pre-line text-2xl font-extrabold">
                {partes.pregunta}
            </h1>

            {!respuesta ? (
                <FormularioRespuesta
                    areaId={id}
                    opciones={pregunta.opciones.map((o) => ({ id: o.id, texto: o.texto }))}
                />
            ) : (
                <div>
                    <div className="flex flex-col gap-3">
                        {pregunta.opciones.map((o, i) => {
                            const elegida = o.id === respuesta.opcionId;
                            const clase = o.esCorrecta
                                ? "border-acierto bg-acierto-claro" +
                                (respuesta.acierto ? " animar-rebote" : "")
                                : elegida
                                    ? "border-rojo bg-rojo-claro animar-sacudida"
                                    : "opacity-60";
                            return (
                                <div
                                    key={o.id}
                                    className={"tarjeta flex items-center gap-3 " + clase}
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-borde bg-fondo text-sm font-extrabold text-gris">
                                        {"ABCD"[i]}
                                    </span>
                                    <span className="flex-1">{o.texto}</span>
                                    {o.esCorrecta && (
                                        <span className="font-extrabold text-acierto-oscuro">✓</span>
                                    )}
                                    {elegida && !o.esCorrecta && (
                                        <span className="font-extrabold text-rojo-oscuro">✗</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div
                        className={
                            "animar-entrada mt-6 rounded-2xl p-5 " +
                            (respuesta.acierto
                                ? "bg-acierto-claro text-acierto-oscuro"
                                : "bg-rojo-claro text-rojo-oscuro")
                        }
                    >
                        <p className="text-xl font-extrabold">
                            {respuesta.acierto ? "¡Correcto!" : "Incorrecto"}
                        </p>
                        <p className="mb-2 font-extrabold">
                            {respuesta.acierto
                                ? "Ganaste " + respuesta.puntaje + " puntos"
                                : "Esta vez no sumaste puntos"}
                        </p>
                        <p className="whitespace-pre-line">{pregunta.explicacion}</p>
                    </div>

                    <div className="sticky bottom-0 -mx-6 mt-4 border-t-2 border-borde bg-fondo p-4">
                        <Link
                            href="/pregunta"
                            className={
                                "boton boton-ancho " +
                                (respuesta.acierto ? "boton-acierto" : "boton-rojo")
                            }
                        >
                            Continuar
                        </Link>
                    </div>
                </div>
            )}
        </main>
    );
}