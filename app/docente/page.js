import Link from "next/link";
import { FileUp, Library, Users } from "lucide-react";
import { prisma } from "../../lib/prisma";
import { exigirDocente } from "../../lib/permisos";
import Formulario from "./formulario";

export default async function Docente() {
    await exigirDocente();

    const areas = await prisma.area.findMany({ orderBy: { id: "asc" } });
    const [totalPreguntas, totalEstudiantes] = await Promise.all([
        prisma.pregunta.count(),
        prisma.usuario.count({ where: { rol: "ESTUDIANTE" } }),
    ]);

    const accesos = [
        ["/docente/preguntas", Library, "Banco de preguntas", totalPreguntas + " preguntas"],
        ["/docente/estudiantes", Users, "Estudiantes", totalEstudiantes + " registrados"],
        ["/docente/importar", FileUp, "Importar preguntas", "Cargar un archivo"],
    ];

    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="text-2xl font-extrabold">Panel del docente</h1>
            <p className="mb-5 text-gris">Administra las preguntas y los estudiantes</p>

            <div className="animar-lista mb-8 grid gap-3">
                {accesos.map(([href, Icono, titulo, detalle]) => (
                    <Link key={href} href={href} className="tarjeta flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-azul-claro text-azul">
                            <Icono size={24} strokeWidth={2.5} />
                        </span>
                        <span>
                            <span className="block text-lg font-extrabold">{titulo}</span>
                            <span className="text-sm text-gris">{detalle}</span>
                        </span>
                    </Link>
                ))}
            </div>

            <h2 className="mb-3 text-xl font-extrabold">Nueva pregunta</h2>
            <Formulario areas={areas} />
        </main>
    );
}