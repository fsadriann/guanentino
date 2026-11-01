import Link from "next/link";
import { ChartColumn, FileUp, Flag, Library, Users } from "lucide-react";
import { prisma } from "../../lib/prisma";
import { exigirDocente } from "../../lib/permisos";
import Formulario from "./formulario";

export default async function Docente() {
    await exigirDocente();

    const areas = await prisma.area.findMany({ orderBy: { id: "asc" } });
    const [totalPreguntas, totalEstudiantes, pendientes] = await Promise.all([
        prisma.pregunta.count(),
        prisma.usuario.count({ where: { rol: "ESTUDIANTE" } }),
        prisma.reportePregunta.count({ where: { estado: "PENDIENTE" } }),
    ]);

    const accesos = [
        {
            href: "/docente/reportes",
            Icono: Flag,
            titulo: "Reportes",
            detalle: pendientes === 0 ? "Sin pendientes" : pendientes + " pendientes",
            alerta: pendientes > 0,
        },
        {
            href: "/docente/dificultad",
            Icono: ChartColumn,
            titulo: "Preguntas más falladas",
            detalle: "Detecta las difíciles o mal planteadas",
        },
        {
            href: "/docente/preguntas",
            Icono: Library,
            titulo: "Banco de preguntas",
            detalle: totalPreguntas + " preguntas",
        },
        {
            href: "/docente/estudiantes",
            Icono: Users,
            titulo: "Estudiantes",
            detalle: totalEstudiantes + " registrados",
        },
        {
            href: "/docente/importar",
            Icono: FileUp,
            titulo: "Importar preguntas",
            detalle: "Cargar un archivo",
        },
    ];

    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="text-2xl font-extrabold">Panel del docente</h1>
            <p className="mb-5 text-gris">Administra las preguntas y los estudiantes</p>

            <div className="animar-lista mb-8 grid gap-3">
                {accesos.map(({ href, Icono, titulo, detalle, alerta }) => (
                    <Link key={href} href={href} className="tarjeta flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-azul-claro text-azul">
                            <Icono size={24} strokeWidth={2.5} />
                        </span>
                        <span>
                            <span className="block text-lg font-extrabold">{titulo}</span>
                            <span
                                className={
                                    "text-sm " +
                                    (alerta ? "font-extrabold text-rojo-oscuro" : "text-gris")
                                }
                            >
                                {detalle}
                            </span>
                        </span>
                    </Link>
                ))}
            </div>

            <h2 className="mb-3 text-xl font-extrabold">Nueva pregunta</h2>
            <Formulario areas={areas} />
        </main>
    );
}