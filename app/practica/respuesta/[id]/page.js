import Link from "next/link";
import { notFound } from "next/navigation";
import { X } from "lucide-react";
import { exigirSesion } from "../../../../lib/permisos";
import { prisma } from "../../../../lib/prisma";
import { estiloArea } from "../../../../lib/areas";
import RevisionPregunta from "../../../../components/RevisionPregunta";
import BarraProgreso from "../../../../components/BarraProgreso";
import BannerRetroalimentacion from "../../../../components/BannerRetroalimentacion";
import {
    progresoPractica,
    resumenHoy,
    siguientePreguntaId,
} from "../../../../services/practica";
import FormularioReporte from "../../../pregunta/[areaId]/formulario-reporte";

const UUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ResultadoPractica({ params, searchParams }) {
    const sesion = await exigirSesion();
    const usuarioId = Number(sesion.user.id);

    const { id } = await params;
    const { destino, s } = await searchParams;
    const respuestaId = Number(id);
    if (!Number.isInteger(respuestaId)) notFound();

    const respuesta = await prisma.respuestaPractica.findUnique({
        where: { id: respuestaId },
        include: {
            pregunta: {
                include: { area: true, opciones: { orderBy: { id: "asc" } } },
            },
        },
    });
    if (!respuesta || respuesta.usuarioId !== usuarioId) notFound();

    const destinoTexto = String(destino ?? "");
    const sigue =
        destinoTexto === "todas" || /^\d+$/.test(destinoTexto)
            ? destinoTexto
            : "todas";

    const areaId = sigue === "todas" ? null : Number(sigue);
    const sesionTexto = String(s ?? "");
    const sesionPractica = UUID.test(sesionTexto)
        ? sesionTexto
        : respuesta.sesion;

    const [resumen, reporte, siguiente, progreso] = await Promise.all([
        resumenHoy(usuarioId),
        prisma.reportePregunta.findUnique({
            where: {
                usuarioId_preguntaId: { usuarioId, preguntaId: respuesta.preguntaId },
            },
            select: { id: true },
        }),
        siguientePreguntaId(
            usuarioId,
            areaId,
            sesionPractica,
            respuesta.preguntaId
        ),
        progresoPractica(usuarioId, areaId, sesionPractica),
    ]);

    const enlaceSiguiente =
        siguiente === null
            ? null
            : "/practica/" +
              sigue +
              (sesionPractica ? "?s=" + sesionPractica + "&p=" : "?p=") +
              siguiente;

    const estilo = estiloArea(respuesta.pregunta.area.nombre);
    const Icono = estilo.Icono;

    return (
        <main className="mx-auto max-w-xl p-6">
            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/practica"
                    aria-label="Terminar la práctica"
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
                    <Icono size={16} strokeWidth={2.5} /> {respuesta.pregunta.area.nombre}
                </span>
            </div>

            <BarraProgreso
                hechas={progreso.respondidas}
                total={progreso.total}
                etiqueta="Progreso de la práctica"
                desde={progreso.respondidas - 1}
            />

            <RevisionPregunta
                pregunta={respuesta.pregunta}
                opcionElegidaId={respuesta.opcionId}
            />

            {enlaceSiguiente === null && (
                <div className="tarjeta mt-4 text-center">
                    <p className="font-extrabold">
                        Terminaste las preguntas de esta práctica
                    </p>
                </div>
            )}

            <BannerRetroalimentacion
                acierto={respuesta.acierto}
                titulo={respuesta.acierto ? "¡Correcto!" : "Solución:"}
                subtitulo={
                    respuesta.acierto
                        ? "Excelente trabajo"
                        : "Revisa la opción correcta"
                }
                explicacion={respuesta.pregunta.explicacion}
                preguntaId={respuesta.preguntaId}
                yaReportado={Boolean(reporte)}
                textoBoton={enlaceSiguiente ? "Siguiente pregunta" : "Terminar práctica"}
                enlaceContinuar={enlaceSiguiente ?? "/practica"}
            />
        </main>
    );
}