import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { exigirSesion } from "../../lib/permisos";
import { topRanking } from "../../services/ranking";

export default async function Ranking() {
    const sesion = await exigirSesion();

    const filas = await topRanking(10);

    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="mb-4 text-2xl font-bold">Ranking</h1>

            {filas.length === 0 ? (
                <p>Todavía nadie ha respondido.</p>
            ) : (
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">#</th>
                            <th className="p-2">Usuario</th>
                            <th className="p-2">Puntos</th>
                            <th className="p-2">Respondidas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filas.map((f) => (
                            <tr
                                key={f.id}
                                className={
                                    "border-b " +
                                    (String(f.id) === sesion.user.id ? "font-bold" : "")
                                }
                            >
                                <td className="p-2">{f.posicion}</td>
                                <td className="p-2">{f.usuario}</td>
                                <td className="p-2">{f.puntos}</td>
                                <td className="p-2">{f.respondidas}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
}