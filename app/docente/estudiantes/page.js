import { prisma } from "../../../lib/prisma";
import { exigirDocente } from "../../../lib/permisos";
import Reiniciar from "./reiniciar";

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
        <main className="mx-auto max-w-4xl p-6">
            <h1 className="mb-1 text-2xl font-bold">Estudiantes</h1>
            <p className="mb-4 opacity-70">Total {estudiantes.length}</p>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Nombre</th>
                            <th className="p-2">Usuario</th>
                            <th className="p-2">Colegio</th>
                            <th className="p-2">Puntos</th>
                            <th className="p-2">Respondidas</th>
                            <th className="p-2">Clave</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantes.map((e) => (
                            <tr key={e.id} className="border-b">
                                <td className="p-2">{e.apellido} {e.nombre}</td>
                                <td className="p-2">{e.usuario}</td>
                                <td className="p-2">{e.colegio ?? "-"}</td>
                                <td className="p-2">{puntos.get(e.id) ?? 0}</td>
                                <td className="p-2">{e._count.respuestas}</td>
                                <td className="p-2"><Reiniciar usuarioId={e.id} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}