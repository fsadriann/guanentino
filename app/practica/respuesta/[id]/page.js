import Link from "next/link";
import { notFound } from "next/navigation";
import { X } from "lucide-react";
import { exigirSesion } from "../../../../lib/permisos";
import { prisma } from "../../../../lib/prisma";
import { estiloArea } from "../../../../lib/areas";
import RevisionPregunta from "../../../../components/RevisionPregunta";
import { resumenHoy } from "../../../../services/practica";
import FormularioReporte from "../../../pregunta/[areaId]/formulario-reporte";

export default async function ResultadoPractica({ params, searchParams }) {
    const sesion = await exigirSesion();
    const usuarioId = Number(sesion.user.id);

    const { id } = await params;
    const { destino } = await searchParams;
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

    const [resumen, reporte] = await Promise.all([
        resumenHoy(usuarioId),
        prisma.reportePregunta.findUnique({
            where: {
                usuarioId_preguntaId: { usuarioId, preguntaId: respuesta.preguntaId },
            },
            select: { id: true },
        }),
    ]);

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

            <div
                className={
                    "animar-entrada mb-6 rounded-2xl p-5 " +
                    (respuesta.acierto
                        ? "bg-acierto-claro text-acierto-oscuro"
                        : "bg-rojo-claro text-rojo-oscuro")
                }
            >
                <p className="text-xl font-extrabold">
                    {respuesta.acierto ? "¡Correcto!" : "Incorrecto"}
                </p>
                <p className="text-sm font-extrabold">
                    La práctica no suma puntos al ranking
                </p>
            </div>

            <RevisionPregunta
                pregunta={respuesta.pregunta}
                opcionElegidaId={respuesta.opcionId}
            />

            <p className="mt-4 text-center text-sm font-extrabold text-gris">
                Hoy llevas {resumen.total} de práctica y {resumen.aciertos}{" "}
                {resumen.aciertos === 1 ? "correcta" : "correctas"}
            </p>

            <div className="mt-4">
                <FormularioReporte
                    preguntaId={respuesta.preguntaId}
                    yaReportado={Boolean(reporte)}
                />
            </div>

            <div className="sticky bottom-0 -mx-6 mt-4 flex flex-col gap-2 border-t-2 border-borde bg-fondo p-4">
                <Link
                    href={"/practica/" + sigue}
                    className={
                        "boton boton-ancho " +
                        (respuesta.acierto ? "boton-acierto" : "boton-rojo")
                    }
                >
                    Siguiente pregunta
                </Link>
                <Link href="/practica" className="boton boton-secundario boton-ancho">
                    Terminar
                </Link>
            </div>
        </main>
    );
}