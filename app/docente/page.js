import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";
import Formulario from "./formulario";

export default async function Docente() {
    const sesion = await auth();
    if (!sesion) redirect("/login");
    if (!["DOCENTE", "ADMIN"].includes(sesion.user.rol)) redirect("/perfil");

    const areas = await prisma.area.findMany({ orderBy: { id: "asc" } });
    const total = await prisma.pregunta.count();

    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="mb-1 text-2xl font-bold">Panel del docente</h1>
            <p className="mb-4 opacity-70">Preguntas en el banco {total}</p>
            <Formulario areas={areas} />
        </main>
    );
}