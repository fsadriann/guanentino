import { prisma } from "../../lib/prisma";
import { exigirDocente } from "../../lib/permisos";
import Formulario from "./formulario";
import Link from "next/link";

export default async function Docente() {
    await exigirDocente();

    const areas = await prisma.area.findMany({ orderBy: { id: "asc" } });
    const total = await prisma.pregunta.count();

    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="mb-1 text-2xl font-bold">Panel del docente</h1>
            <p className="mb-4 opacity-70">Preguntas en el banco {total}</p>

            <nav className="mb-6 flex gap-4 text-blue-500 underline">
                <Link href="/docente/preguntas">Ver banco de preguntas</Link>
                <Link href="/docente/estudiantes">Ver estudiantes</Link>
            </nav>

            <Formulario areas={areas} />
        </main>
    );
}