import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, CheckCircle2, X, XCircle } from "lucide-react";
import { exigirSesion } from "../../../lib/permisos";
import { prisma } from "../../../lib/prisma";
import { estiloArea } from "../../../lib/areas";
import { separarEnunciado } from "../../../lib/enunciado";
import { textoAHtml } from "../../../lib/matematicas";
import { preguntaDelDia } from "../../../services/preguntas";
import Texto from "../../../components/Texto";
import ImagenPregunta from "../../../components/ImagenPregunta";
import FormularioRespuesta from "../../../components/FormularioRespuesta";
import BannerRetroalimentacion from "../../../components/BannerRetroalimentacion";
import { responder } from "../actions";
import FormularioReporte from "./formulario-reporte";

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
            <main className="animar-entrada mx-auto max-w-xl p-6">
                <Link href="/pregunta" aria-label="Volver" className="text-gris">
                    <X size={26} strokeWidth={3} />
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

    const reporte = respuesta
        ? await prisma.reportePregunta.findUnique({
            where: {
                usuarioId_preguntaId: {
                    usuarioId: Number(sesion.user.id),
                    preguntaId: pregunta.id,
                },
            },
            select: { id: true },
        })
        : null;

    const estilo = estiloArea(pregunta.area.nombre);
    const Icono = estilo.Icono;
    const partes = separarEnunciado(pregunta.enunciado);

    return (
        <main className="animar-entrada mx-auto max-w-xl p-6">
            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/pregunta"
                    aria-label="Volver"
                    className="text-gris hover:text-texto"
                >
                    <X size={26} strokeWidth={3} />
                </Link>
                <span
                    className={
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-extrabold text-white " +
                        estilo.fondo
                    }
                >
                    <Icono size={16} strokeWidth={2.5} /> {pregunta.area.nombre}
                </span>
            </div>

            {partes.instruccion && (
                <p className="mb-2 text-sm font-extrabold uppercase tracking-wide text-gris">
                    <Texto>{partes.instruccion}</Texto>
                </p>
            )}

            {partes.texto && (
                <div className="tarjeta mb-4 bg-superficie leading-relaxed">
                    <Texto>{partes.texto}</Texto>
                </div>
            )}

            <ImagenPregunta id={pregunta.imagenId} alt={pregunta.imagenAlt} />

            <h1 className="mb-6 text-2xl font-extrabold">
                <Texto>{partes.pregunta}</Texto>
            </h1>

            {!respuesta ? (
                <FormularioRespuesta
                    accion={responder}
                    campos={{ areaId: id }}
                    opciones={pregunta.opciones.map((o) => ({
                        id: o.id,
                        html: textoAHtml(o.texto, { enLinea: true }),
                    }))}
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
                                    <span className="flex-1">
                                        <Texto enLinea>{o.texto}</Texto>
                                    </span>
                                    {o.esCorrecta && (
                                        <Check
                                            size={22}
                                            strokeWidth={3}
                                            className="shrink-0 text-acierto-oscuro"
                                        />
                                    )}
                                    {elegida && !o.esCorrecta && (
                                        <X
                                            size={22}
                                            strokeWidth={3}
                                            className="shrink-0 text-rojo-oscuro"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <BannerRetroalimentacion
                        acierto={respuesta.acierto}
                        titulo={respuesta.acierto ? "¡Correcto!" : "Solución:"}
                        subtitulo={
                            respuesta.acierto
                                ? `+${respuesta.puntaje} puntos`
                                : "Esta vez no sumaste puntos"
                        }
                        explicacion={pregunta.explicacion}
                        preguntaId={pregunta.id}
                        yaReportado={Boolean(reporte)}
                        textoBoton="Continuar"
                        enlaceContinuar="/pregunta"
                    />
                </div>
            )}
        </main>
    );
}