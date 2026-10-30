import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { exigirDocente } from "../../../../lib/permisos";
import Formulario from "./formulario";

export default async function Editar({ params }) {
    await exigirDocente();

    const { id } = await params;
    const preguntaId = Number(id);
    if (!Number.isInteger(preguntaId)) notFound();

    const pregunta = await prisma.pregunta.findUnique({
        where: { id: preguntaId },
        include: {
            opciones: { orderBy: { id: "asc" } },
            _count: { select: { respuestas: true } },
        },
    });
    if (!pregunta) notFound();

    const areas = await prisma.area.findMany({ orderBy: { id: "asc" } });

    return (
        <main className="mx-auto max-w-xl p-6">
            <Link href="/docente/preguntas" className="text-blue-500 underline">
                Volver al banco
            </Link>
            <h1 className="my-4 text-2xl font-bold">Editar pregunta</h1>
            <Formulario
                pregunta={pregunta}
                areas={areas}
                bloqueada={pregunta._count.respuestas > 0}
            />
        </main>
    );
}