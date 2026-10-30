import { prisma } from "../../../lib/prisma";
import { exigirDocente } from "../../../lib/permisos";
import Borrar from "./borrar";

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
        <main className="mx-auto max-w-4xl p-6">
            <h1 className="mb-1 text-2xl font-bold">Banco de preguntas</h1>
            <p className="mb-4 opacity-70">Total {preguntas.length}</p>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Área</th>
                            <th className="p-2">Enunciado</th>
                            <th className="p-2">Respuestas</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {preguntas.map((p) => (
                            <tr key={p.id} className="border-b">
                                <td className="p-2">{p.area.nombre}</td>
                                <td className="p-2">
                                    {p.enunciado.length > 80 ? p.enunciado.slice(0, 80) + "..." : p.enunciado}
                                </td>
                                <td className="p-2">{p._count.respuestas}</td>
                                <td className="p-2">
                                    {p._count.respuestas === 0 ? (
                                        <Borrar preguntaId={p.id} />
                                    ) : (
                                        <span className="text-sm opacity-60">Ya respondida</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}