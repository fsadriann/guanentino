import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { exigirDocente } from "../../../lib/permisos";
import { estiloArea } from "../../../lib/areas";
import Borrar from "./borrar";
import EnlaceVolver from "../../../components/EnlaceVolver";

export default async function Preguntas() {
    await exigirDocente();

    const preguntas = await prisma.pregunta.findMany({
        orderBy: { id: "desc" },
        include: {
            area: true,
            _count: { select: { respuestas: true } },
        },
    });

    return (
        <main className="mx-auto max-w-xl p-6">
            <EnlaceVolver href="/docente">Panel del docente</EnlaceVolver>
            <h1 className="mt-3 text-2xl font-extrabold">Banco de preguntas</h1>
            <p className="mb-5 text-gris">{preguntas.length} preguntas</p>

            {preguntas.length === 0 ? (
                <div className="tarjeta text-center text-gris">
                    Todavía no hay preguntas. Crea una desde el panel o importa un archivo.
                </div>
            ) : (
                <div className="animar-lista flex flex-col gap-3">
                    {preguntas.map((p) => {
                        const estilo = estiloArea(p.area.nombre);
                        const Icono = estilo.Icono;
                        const resumen = p.enunciado.replace(/\s+/g, " ");
                        const respuestas = p._count.respuestas;
                        return (
                            <div key={p.id} className="tarjeta">
                                <span
                                    className={
                                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold text-white " +
                                        estilo.fondo
                                    }
                                >
                                    <Icono size={14} strokeWidth={2.5} /> {p.area.nombre}
                                </span>
                                <p className="mt-2">
                                    {resumen.length > 110 ? resumen.slice(0, 110) + "..." : resumen}
                                </p>
                                <div className="mt-3 flex items-center justify-between gap-3 border-t-2 border-borde pt-3">
                                    <span className="text-sm text-gris">
                                        {respuestas} {respuestas === 1 ? "respuesta" : "respuestas"}
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <Link
                                            href={`/docente/preguntas/${p.id}`}
                                            className="text-sm font-extrabold text-azul"
                                        >
                                            Editar
                                        </Link>
                                        {respuestas === 0 ? (
                                            <Borrar preguntaId={p.id} />
                                        ) : (
                                            <span className="text-xs text-gris">Ya respondida</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}