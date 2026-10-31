import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";
import { preguntaDelDia } from "../../services/preguntas";

export default async function Preguntas() {
    const sesion = await auth();
    if (!sesion) redirect("/login");

    const areas = await prisma.area.findMany({ orderBy: { id: "asc" } });
    const delDia = await Promise.all(areas.map((a) => preguntaDelDia(a.id)));

    const ids = delDia.filter(Boolean).map((p) => p.id);
    const respuestas = await prisma.respuesta.findMany({
        where: { usuarioId: Number(sesion.user.id), preguntaId: { in: ids } },
        select: { preguntaId: true, acierto: true },
    });
    const porPregunta = new Map(respuestas.map((r) => [r.preguntaId, r]));

    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="mb-1 text-2xl font-bold">Preguntas del día</h1>
            <p className="mb-4 opacity-70">Elige un área para responder</p>

            <div className="flex flex-col gap-3">
                {areas.map((area, i) => {
                    const pregunta = delDia[i];
                    const respuesta = pregunta ? porPregunta.get(pregunta.id) : null;

                    if (!pregunta) {
                        return (
                            <div key={area.id} className="rounded border p-4 opacity-50">
                                <p className="font-bold">{area.nombre}</p>
                                <p className="text-sm">Todavía no hay preguntas</p>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={area.id}
                            href={"/pregunta/" + area.id}
                            className="rounded border p-4 hover:bg-white/5"
                        >
                            <p className="font-bold">{area.nombre}</p>
                            <p className="text-sm opacity-70">
                                {!respuesta
                                    ? "Pendiente"
                                    : respuesta.acierto
                                        ? "Respondida, acertaste"
                                        : "Respondida, fallaste"}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </main>
    );
}