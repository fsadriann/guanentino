import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { X } from "lucide-react";
import { exigirSesion } from "../../../../lib/permisos";
import { estiloArea } from "../../../../lib/areas";
import { separarEnunciado } from "../../../../lib/enunciado";
import { textoAHtml } from "../../../../lib/matematicas";
import Texto from "../../../../components/Texto";
import ImagenPregunta from "../../../../components/ImagenPregunta";
import FormularioRespuesta from "../../../../components/FormularioRespuesta";
import BarraProgreso from "../../../../components/BarraProgreso";
import CronometroSimulacro from "../../../../components/CronometroSimulacro";
import {
    obtenerSimulacro,
    terminarSimulacro,
} from "../../../../services/simulacros";
import { responderSimulacro } from "../actions";

export default async function SimulacroPagina({ params }) {
    const sesion = await exigirSesion();
    const usuarioId = Number(sesion.user.id);

    const { id } = await params;
    const simulacroId = Number(id);
    if (!Number.isInteger(simulacroId)) notFound();

    const simulacro = await obtenerSimulacro(simulacroId, usuarioId);
    if (!simulacro) notFound();

    const resultado = "/practica/simulacro/" + simulacroId + "/resultado";
    if (simulacro.terminado) redirect(resultado);

    const indice = simulacro.preguntas.findIndex((sp) => sp.opcionId === null);
    if (indice === -1) {
        await terminarSimulacro(simulacroId, usuarioId);
        redirect(resultado);
    }

    const total = simulacro.preguntas.length;
    const hechas = simulacro.preguntas.filter((sp) => sp.opcionId !== null).length;
    const actual = simulacro.preguntas[indice].pregunta;
    const partes = separarEnunciado(actual.enunciado);
    const estilo = estiloArea(actual.area.nombre);
    const Icono = estilo.Icono;

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
                <span
                    className={
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-extrabold text-white " +
                        estilo.fondo
                    }
                >
                    <Icono size={16} strokeWidth={2.5} /> {actual.area.nombre}
                </span>
                <span className="text-sm font-extrabold text-gris">Simulacro</span>
                <CronometroSimulacro
                    simulacroId={simulacroId}
                    restanteMs={simulacro.restanteMs}
                />
            </div>

            <BarraProgreso
                key={"barra-" + hechas}
                hechas={hechas}
                desde={hechas - 1}
                total={total}
                etiqueta="Progreso del simulacro"
            />

            <div key={"pregunta-" + actual.id} className="animar-entrada">
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

                <ImagenPregunta id={actual.imagenId} alt={actual.imagenAlt} />

                <h1 className="mb-6 text-2xl font-extrabold">
                    <Texto>{partes.pregunta}</Texto>
                </h1>
            </div>

            <FormularioRespuesta
                key={"formulario-" + actual.id}
                accion={responderSimulacro}
                campos={{ simulacroId, preguntaId: actual.id }}
                textoBoton={indice === total - 1 ? "Terminar" : "Comprobar"}
                opciones={actual.opciones.map((o) => ({
                    id: o.id,
                    html: textoAHtml(o.texto, { enLinea: true }),
                }))}
            />
        </main>
    );
}