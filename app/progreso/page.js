import Link from "next/link";
import { ChevronDown, Lightbulb } from "lucide-react";
import { exigirSesion } from "../../lib/permisos";
import { prisma } from "../../lib/prisma";
import { estiloArea } from "../../lib/areas";
import { separarEnunciado } from "../../lib/enunciado";
import { textoPlano } from "../../lib/matematicas";
import RevisionPregunta from "../../components/RevisionPregunta";
import BarraProgreso from "../../components/BarraProgreso";
import { preguntaDelDia } from "../../services/preguntas";

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "short",
        timeZone: "America/Bogota",
    });
}

export default async function Progreso({ searchParams }) {
    const sesion = await exigirSesion();
    const usuarioId = Number(sesion.user.id);

    const { area } = await searchParams;
    const areaFiltro = Number(area);
    const hayFiltro = Number.isInteger(areaFiltro) && areaFiltro > 0;

    const [areas, respuestas] = await Promise.all([
        prisma.area.findMany({ orderBy: { id: "asc" } }),
        prisma.respuesta.findMany({
            where: { usuarioId },
            select: { acierto: true, pregunta: { select: { areaId: true } } },
        }),
    ]);
    const preguntasDelDia = await Promise.all(areas.map((a) => preguntaDelDia(a.id)));
    const idsDelDia = preguntasDelDia.filter(Boolean).map((p) => p.id);
    const respuestasDeHoy = idsDelDia.length
        ? await prisma.respuesta.count({
            where: { usuarioId, preguntaId: { in: idsDelDia } },
        })
        : 0;

    const total = respuestas.length;
    const aciertosTotal = respuestas.filter((r) => r.acierto).length;
    const totalErrores = total - aciertosTotal;
    const porcentajeTotal = total ? Math.round((aciertosTotal / total) * 100) : 0;

    const porArea = areas.map((a) => {
        const delArea = respuestas.filter((r) => r.pregunta.areaId === a.id);
        const aciertos = delArea.filter((r) => r.acierto).length;
        return {
            area: a,
            total: delArea.length,
            aciertos,
            porcentaje: delArea.length
                ? Math.round((aciertos / delArea.length) * 100)
                : 0,
        };
    });

    const comparables = porArea.filter((p) => p.total >= 3);
    const masDebil =
        comparables.length >= 2
            ? comparables.reduce((a, b) => (b.porcentaje < a.porcentaje ? b : a))
            : null;
    const mostrarConsejo = masDebil && masDebil.porcentaje < 70;

    const errores = await prisma.respuesta.findMany({
        where: {
            usuarioId,
            acierto: false,
            ...(hayFiltro ? { pregunta: { areaId: areaFiltro } } : {}),
        },
        orderBy: { fecha: "desc" },
        take: 30,
        include: {
            pregunta: {
                include: { area: true, opciones: { orderBy: { id: "asc" } } },
            },
        },
    });

    const chips = [
        { href: "/progreso", texto: "Todas", activo: !hayFiltro },
        ...areas.map((a) => ({
            href: "/progreso?area=" + a.id,
            texto: a.nombre,
            activo: hayFiltro && areaFiltro === a.id,
        })),
    ];

    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="text-2xl font-extrabold">Mi progreso</h1>
            <p className="mb-5 text-gris">Mira cómo vas en cada área</p>

            {idsDelDia.length > 0 && (
                <div className="tarjeta mb-6">
                    <BarraProgreso
                        hechas={respuestasDeHoy}
                        total={idsDelDia.length}
                        etiqueta="Meta de hoy"
                    />
                    <p className="text-sm text-gris">
                        {respuestasDeHoy === idsDelDia.length
                            ? "Completaste todas las áreas de hoy."
                            : "Responde una pregunta en cada área para completar tu meta."}
                    </p>
                </div>
            )}

            {total === 0 ? (
                <div className="tarjeta text-center">
                    <p className="mb-3 text-gris">
                        Todavía no has respondido preguntas. Cuando empieces, aquí verás tu
                        avance.
                    </p>
                    <Link href="/pregunta" className="boton">
                        Ir a las preguntas
                    </Link>
                </div>
            ) : (
                <>
                    <div className="mb-6 grid grid-cols-2 gap-3">
                        <div className="tarjeta">
                            <p className="text-2xl font-extrabold">{total}</p>
                            <p className="text-sm font-extrabold uppercase tracking-wide text-gris">
                                Respondidas
                            </p>
                        </div>
                        <div className="tarjeta">
                            <p className="text-2xl font-extrabold text-acierto-oscuro">
                                {porcentajeTotal}%
                            </p>
                            <p className="text-sm font-extrabold uppercase tracking-wide text-gris">
                                De aciertos
                            </p>
                        </div>
                    </div>

                    <h2 className="mb-3 text-xl font-extrabold">Por área</h2>
                    <div className="animar-lista mb-6 flex flex-col gap-3">
                        {porArea.map((p) => {
                            const estilo = estiloArea(p.area.nombre);
                            const Icono = estilo.Icono;
                            return (
                                <div key={p.area.id} className="tarjeta">
                                    <div className="mb-2 flex items-center gap-3">
                                        <span
                                            className={
                                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-b-4 text-white " +
                                                estilo.circulo
                                            }
                                        >
                                            <Icono size={18} strokeWidth={2.5} />
                                        </span>
                                        <span className="flex-1 font-extrabold">{p.area.nombre}</span>
                                        <span className="font-extrabold">
                                            {p.total ? p.porcentaje + "%" : "-"}
                                        </span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-borde">
                                        <div
                                            className={"h-full rounded-full " + estilo.fondo}
                                            style={{ width: p.porcentaje + "%" }}
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gris">
                                        {p.total
                                            ? p.aciertos + " de " + p.total + " correctas"
                                            : "Sin respuestas todavía"}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {mostrarConsejo && (
                        <div className="tarjeta mb-6 flex items-start gap-3 border-amarillo">
                            <Lightbulb
                                size={22}
                                strokeWidth={2.5}
                                className="mt-0.5 shrink-0 text-amarillo-oscuro"
                            />
                            <p>
                                Por ahora tu área más difícil es{" "}
                                <span className="font-extrabold">{masDebil.area.nombre}</span>{" "}
                                con {masDebil.porcentaje}% de aciertos. Vale la pena repasar
                                sus errores.
                            </p>
                        </div>
                    )}

                    <h2 className="mb-1 text-xl font-extrabold">Para repasar</h2>
                    <p className="mb-3 text-gris">
                        {totalErrores === 0
                            ? "No has fallado ninguna pregunta"
                            : totalErrores +
                            (totalErrores === 1
                                ? " pregunta fallada"
                                : " preguntas falladas")}
                    </p>

                    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                        {chips.map((c) => (
                            <Link
                                key={c.href}
                                href={c.href}
                                scroll={false}
                                className={
                                    "shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-extrabold " +
                                    (c.activo
                                        ? "border-azul bg-azul-claro text-azul"
                                        : "border-borde text-gris hover:bg-superficie")
                                }
                            >
                                {c.texto}
                            </Link>
                        ))}
                    </div>

                    {errores.length === 0 ? (
                        <div className="tarjeta text-center text-gris">
                            {hayFiltro
                                ? "No tienes errores en esta área."
                                : "¡Sin errores por repasar!"}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {errores.map((r) => {
                                const estilo = estiloArea(r.pregunta.area.nombre);
                                const Icono = estilo.Icono;
                                const resumen = textoPlano(
                                    separarEnunciado(r.pregunta.enunciado).pregunta,
                                    110
                                );
                                return (
                                    <details key={r.id} className="tarjeta group">
                                        <summary className="flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden">
                                            <span
                                                className={
                                                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white " +
                                                    estilo.fondo
                                                }
                                            >
                                                <Icono size={14} strokeWidth={2.5} />
                                            </span>
                                            <span className="flex-1">
                                                <span className="block text-sm text-gris">
                                                    {r.pregunta.area.nombre} · {formatearFecha(r.fecha)}
                                                </span>
                                                <span className="block font-extrabold">{resumen}</span>
                                            </span>
                                            <ChevronDown
                                                size={20}
                                                strokeWidth={3}
                                                className="mt-1 shrink-0 text-gris group-open:rotate-180"
                                            />
                                        </summary>

                                        <div className="mt-4 border-t-2 border-borde pt-4">
                                            <RevisionPregunta
                                                pregunta={r.pregunta}
                                                opcionElegidaId={r.opcionId}
                                            />
                                        </div>
                                    </details>
                                );
                            })}
                        </div>
                    )}

                    {totalErrores > 30 && !hayFiltro && (
                        <p className="mt-3 text-center text-sm text-gris">
                            Se muestran las 30 más recientes.
                        </p>
                    )}
                </>
            )}
        </main>
    );
}