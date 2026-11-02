import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "../../../lib/prisma";
import { exigirDocente } from "../../../lib/permisos";
import { estiloArea } from "../../../lib/areas";
import { separarEnunciado } from "../../../lib/enunciado";
import { textoPlano } from "../../../lib/matematicas";
import EnlaceVolver from "../../../components/EnlaceVolver";
import RevisionPregunta from "../../../components/RevisionPregunta";
import { resolverReportes } from "./actions";

const etiquetas = {
    RESPUESTA_INCORRECTA: "Respuesta correcta dudosa",
    ENUNCIADO_CONFUSO: "Pregunta confusa",
    ERROR_DE_TEXTO: "Error de texto",
    OTRO: "Otro",
};

export default async function Reportes() {
    await exigirDocente();

    const [reportes, atendidos] = await Promise.all([
        prisma.reportePregunta.findMany({
            where: { estado: "PENDIENTE" },
            orderBy: { fecha: "desc" },
            include: {
                pregunta: {
                    include: { area: true, opciones: { orderBy: { id: "asc" } } },
                },
            },
        }),
        prisma.reportePregunta.count({ where: { estado: { not: "PENDIENTE" } } }),
    ]);

    const grupos = new Map();
    for (const r of reportes) {
        if (!grupos.has(r.preguntaId)) {
            grupos.set(r.preguntaId, { pregunta: r.pregunta, reportes: [] });
        }
        grupos.get(r.preguntaId).reportes.push(r);
    }
    const lista = [...grupos.values()].sort(
        (a, b) => b.reportes.length - a.reportes.length
    );

    return (
        <main className="mx-auto max-w-xl p-6">
            <EnlaceVolver href="/docente">Panel del docente</EnlaceVolver>
            <h1 className="mt-3 text-2xl font-extrabold">Reportes</h1>
            <p className="mb-5 text-gris">
                {lista.length === 0
                    ? "No hay reportes pendientes"
                    : lista.length +
                    (lista.length === 1
                        ? " pregunta con reportes"
                        : " preguntas con reportes")}
                {atendidos > 0 && " · " + atendidos + " ya atendidos"}
            </p>

            {lista.length === 0 ? (
                <div className="tarjeta text-center text-gris">
                    Cuando un estudiante reporte un problema, aparecerá aquí.
                </div>
            ) : (
                <div className="animar-lista flex flex-col gap-4">
                    {lista.map(({ pregunta, reportes: rs }) => {
                        const estilo = estiloArea(pregunta.area.nombre);
                        const Icono = estilo.Icono;
                        const resumen = textoPlano(
                            separarEnunciado(pregunta.enunciado).pregunta,
                            140
                        );

                        const conteo = {};
                        for (const r of rs) conteo[r.motivo] = (conteo[r.motivo] ?? 0) + 1;
                        const comentarios = rs.filter((r) => r.comentario);

                        return (
                            <div key={pregunta.id} className="tarjeta">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <span
                                        className={
                                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold text-white " +
                                            estilo.fondo
                                        }
                                    >
                                        <Icono size={14} strokeWidth={2.5} /> {pregunta.area.nombre}
                                    </span>
                                    <span className="text-sm font-extrabold text-rojo-oscuro">
                                        {rs.length} {rs.length === 1 ? "reporte" : "reportes"}
                                    </span>
                                </div>

                                <p className="font-extrabold">{resumen}</p>

                                <ul className="mt-3 flex flex-wrap gap-2">
                                    {Object.entries(conteo).map(([motivo, n]) => (
                                        <li
                                            key={motivo}
                                            className="rounded-full bg-superficie px-3 py-1 text-xs font-extrabold text-gris"
                                        >
                                            {etiquetas[motivo]} · {n}
                                        </li>
                                    ))}
                                </ul>

                                {comentarios.length > 0 && (
                                    <div className="mt-3 flex flex-col gap-2">
                                        {comentarios.map((r) => (
                                            <p
                                                key={r.id}
                                                className="whitespace-pre-line rounded-2xl bg-superficie p-3 text-sm"
                                            >
                                                {r.comentario}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                <details className="mt-3">
                                    <summary className="cursor-pointer text-sm font-extrabold text-azul">
                                        Ver pregunta completa
                                    </summary>
                                    <div className="mt-3">
                                        <RevisionPregunta pregunta={pregunta} />
                                    </div>
                                </details>

                                <div className="mt-4 flex flex-wrap items-center gap-3 border-t-2 border-borde pt-3">
                                    <Link
                                        href={"/docente/preguntas/" + pregunta.id}
                                        className="boton boton-azul gap-2 px-4 py-2 text-xs"
                                    >
                                        <Pencil size={14} strokeWidth={2.5} /> Editar
                                    </Link>

                                    <form action={resolverReportes}>
                                        <input type="hidden" name="preguntaId" value={pregunta.id} />
                                        <input type="hidden" name="estado" value="RESUELTO" />
                                        <button className="boton boton-secundario px-4 py-2 text-xs">
                                            Marcar resuelto
                                        </button>
                                    </form>

                                    <form action={resolverReportes}>
                                        <input type="hidden" name="preguntaId" value={pregunta.id} />
                                        <input type="hidden" name="estado" value="DESCARTADO" />
                                        <button className="px-2 py-2 text-xs font-extrabold uppercase tracking-wide text-gris underline">
                                            Descartar
                                        </button>
                                    </form>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}