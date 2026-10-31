import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { exigirDocente } from "../../../lib/permisos";
import Reiniciar from "./reiniciar";
import { Star } from "lucide-react";
import EnlaceVolver from "../../../components/EnlaceVolver";

export default async function Estudiantes() {
    await exigirDocente();

    const estudiantes = await prisma.usuario.findMany({
        where: { rol: "ESTUDIANTE" },
        orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
        select: {
            id: true,
            usuario: true,
            nombre: true,
            apellido: true,
            colegio: true,
            _count: { select: { respuestas: true } },
        },
    });

    const grupos = await prisma.respuesta.groupBy({
        by: ["usuarioId"],
        _sum: { puntaje: true },
    });
    const puntos = new Map(grupos.map((g) => [g.usuarioId, g._sum.puntaje ?? 0]));

    return (
        <main className="mx-auto max-w-xl p-6">
            <EnlaceVolver href="/docente">Panel del docente</EnlaceVolver>
            <h1 className="mt-3 text-2xl font-extrabold">Estudiantes</h1>
            <p className="mb-5 text-gris">{estudiantes.length} registrados</p>

            {estudiantes.length === 0 ? (
                <div className="tarjeta text-center text-gris">
                    Todavía no hay estudiantes registrados.
                </div>
            ) : (
                <div className="animar-lista flex flex-col gap-3">
                    {estudiantes.map((e) => (
                        <div key={e.id} className="tarjeta">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-extrabold">
                                        {e.apellido} {e.nombre}
                                    </p>
                                    <p className="text-sm text-gris">
                                        @{e.usuario}
                                        {e.colegio ? " · " + e.colegio : ""}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="flex items-center justify-end gap-1 font-extrabold text-amarillo-oscuro">
                                        <Star size={16} strokeWidth={2.5} fill="currentColor" />
                                        {puntos.get(e.id) ?? 0}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 border-t-2 border-borde pt-3">
                                <Reiniciar usuarioId={e.id} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}