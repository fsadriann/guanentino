import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "../../../lib/prisma";
import { exigirDocente } from "../../../lib/permisos";
import { estiloArea } from "../../../lib/areas";
import { separarEnunciado } from "../../../lib/enunciado";
import EnlaceVolver from "../../../components/EnlaceVolver";
import { textoPlano } from "../../../lib/matematicas";

const MINIMO_RESPUESTAS = 5;

export default async function Dificultad() {
    await exigirDocente();

    const [totales, fallos] = await Promise.all([
        prisma.respuesta.groupBy({
            by: ["preguntaId"],
            _count: { _all: true },
        }),
        prisma.respuesta.groupBy({
            by: ["preguntaId"],
            where: { acierto: false },
            _count: { _all: true },
        }),
    ]);

    const fallosPor = new Map(fallos.map((f) => [f.preguntaId, f._count._all]));

    const filas = totales
        .filter((t) => t._count._all >= MINIMO_RESPUESTAS)
        .map((t) => {
            const total = t._count._all;
            const falladas = fallosPor.get(t.preguntaId) ?? 0;
            return {
                preguntaId: t.preguntaId,
                total,
                falladas,
                porcentaje: Math.round((falladas / total) * 100),
            };
        })
        .sort((a, b) => b.porcentaje - a.porcentaje || b.total - a.total)
        .slice(0, 20);

    const preguntas = await prisma.pregunta.findMany({
        where: { id: { in: filas.map((f) => f.preguntaId) } },
        include: { area: true },
    });
    const porId = new Map(preguntas.map((p) => [p.id, p]));

    return (
        <main className="mx-auto max-w-xl p-6">
            <EnlaceVolver href="/docente">Panel del docente</EnlaceVolver>
            <h1 className="mt-3 text-2xl font-extrabold">Preguntas más falladas</h1>
            <p className="mb-5 text-gris">
                Preguntas con al menos {MINIMO_RESPUESTAS} respuestas, de la más fallada
                a la menos fallada. Que una pregunta se falle mucho no siempre significa
                que esté mal, pero conviene revisarla.
            </p>

            {filas.length === 0 ? (
                <div className="tarjeta text-center text-gris">
                    Todavía no hay preguntas con {MINIMO_RESPUESTAS} respuestas o más.
                </div>
            ) : (
                <div className="animar-lista flex flex-col gap-3">
                    {filas.map((f) => {
                        const pregunta = porId.get(f.preguntaId);
                        if (!pregunta) return null;
                        const estilo = estiloArea(pregunta.area.nombre);
                        const Icono = estilo.Icono;
                        const resumen = textoPlano(separarEnunciado(pregunta.enunciado).pregunta);
                        return (
                            <div key={f.preguntaId} className="tarjeta">
                                <span
                                    className={
                                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold text-white " +
                                        estilo.fondo
                                    }
                                >
                                    <Icono size={14} strokeWidth={2.5} /> {pregunta.area.nombre}
                                </span>
                                <p className="mt-2">
                                    {resumen.length > 110 ? resumen.slice(0, 110) + "..." : resumen}
                                </p>

                                <div className="mt-3 h-3 overflow-hidden rounded-full bg-borde">
                                    <div
                                        className="h-full rounded-full bg-relleno-rojo"
                                        style={{ width: f.porcentaje + "%" }}
                                    />
                                </div>
                                <div className="mt-1 flex items-center justify-between gap-3">
                                    <p className="text-sm text-gris">
                                        <span className="font-extrabold text-rojo-oscuro">
                                            {f.porcentaje}%
                                        </span>{" "}
                                        fallaron ({f.falladas} de {f.total})
                                    </p>
                                    <Link
                                        href={"/docente/preguntas/" + f.preguntaId}
                                        className="inline-flex items-center gap-1 text-sm font-extrabold text-azul"
                                    >
                                        <Pencil size={14} strokeWidth={2.5} /> Editar
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}