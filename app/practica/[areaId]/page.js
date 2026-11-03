import { randomUUID } from "node:crypto";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { X } from "lucide-react";
import { exigirSesion } from "../../../lib/permisos";
import { prisma } from "../../../lib/prisma";
import { estiloArea } from "../../../lib/areas";
import { separarEnunciado } from "../../../lib/enunciado";
import { textoAHtml } from "../../../lib/matematicas";
import Texto from "../../../components/Texto";
import ImagenPregunta from "../../../components/ImagenPregunta";
import FormularioRespuesta from "../../../components/FormularioRespuesta";
import BarraProgreso from "../../../components/BarraProgreso";
import {
    buscarPreguntaPractica,
    progresoPractica,
    resumenHoy,
    siguientePreguntaId,
} from "../../../services/practica";
import { responderPractica } from "../actions";

const UUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function PracticaPregunta({ params, searchParams }) {
    const sesion = await exigirSesion();
    const usuarioId = Number(sesion.user.id);

    const { areaId: parametro } = await params;
    const { p, s } = await searchParams;

    const todas = parametro === "todas";
    const areaId = todas ? null : Number(parametro);
    if (!todas && !Number.isInteger(areaId)) notFound();

    const sesionValida = typeof s === "string" && UUID.test(s);
    const sesionPractica = sesionValida ? s : randomUUID();

    const [area, resumen, progreso, pregunta] = await Promise.all([
        todas
            ? null
            : prisma.area.findUnique({
                  where: { id: areaId },
                  select: { id: true },
              }),
        resumenHoy(usuarioId),
        progresoPractica(usuarioId, areaId, sesionPractica),
        buscarPreguntaPractica(
            usuarioId,
            areaId,
            sesionPractica,
            Number(p)
        ),
    ]);

    if (!todas && !area) notFound();
    if (resumen.llegoAlLimite) redirect("/practica?limite=1");

    if (!pregunta) {
        const siguiente = await siguientePreguntaId(
            usuarioId,
            areaId,
            sesionPractica
        );
        if (siguiente === null) {
            return (
                <main className="animar-entrada mx-auto max-w-xl p-6">
                    <Link
                        href="/practica"
                        aria-label="Terminar la práctica"
                        className="text-gris"
                    >
                        <X size={26} strokeWidth={3} />
                    </Link>
                    <div className="mt-4">
                        <BarraProgreso
                            hechas={progreso.respondidas}
                            total={progreso.total}
                            etiqueta="Progreso de la práctica"
                        />
                    </div>
                    <div className="tarjeta text-center">
                        <p className="font-extrabold">
                            {progreso.total > 0
                                ? "Ya respondiste todas las preguntas de esta práctica"
                                : "Todavía no hay preguntas para practicar en esta área."}
                        </p>
                        {progreso.total > 0 && (
                            <p className="mt-1 text-sm text-gris">
                                Vuelve al menú para empezar otra práctica.
                            </p>
                        )}
                    </div>
                    <Link href="/practica" className="boton boton-ancho mt-4">
                        Terminar
                    </Link>
                </main>
            );
        }
        redirect(
            "/practica/" +
                parametro +
                "?s=" +
                sesionPractica +
                "&p=" +
                siguiente
        );
    }

    if (!sesionValida) {
        redirect(
            "/practica/" +
                parametro +
                "?s=" +
                sesionPractica +
                "&p=" +
                pregunta.id
        );
    }

    const estilo = estiloArea(pregunta.area.nombre);
    const Icono = estilo.Icono;
    const partes = separarEnunciado(pregunta.enunciado);

    return (
        <main className="mx-auto max-w-xl p-6">
            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/practica"
                    aria-label="Salir de la práctica"
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
                <span className="text-sm font-extrabold text-gris">Práctica libre</span>
            </div>

            <BarraProgreso
                hechas={progreso.respondidas}
                total={progreso.total}
                etiqueta="Progreso de la práctica"
            />

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

            <FormularioRespuesta
                accion={responderPractica}
                campos={{
                    preguntaId: pregunta.id,
                    destino: parametro,
                    sesion: sesionPractica,
                }}
                opciones={pregunta.opciones.map((o) => ({
                    id: o.id,
                    html: textoAHtml(o.texto, { enLinea: true }),
                }))}
            />
        </main>
    );
}
