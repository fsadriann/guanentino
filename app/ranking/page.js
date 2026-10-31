import { exigirSesion } from "../../lib/permisos";
import { topRanking } from "../../services/ranking";

const medallas = ["🥇", "🥈", "🥉"];

export default async function Ranking() {
    const sesion = await exigirSesion();
    const filas = await topRanking(10);

    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="text-2xl font-extrabold">Ranking</h1>
            <p className="mb-5 text-gris">Los 10 estudiantes con más puntos</p>

            {filas.length === 0 ? (
                <div className="tarjeta text-center text-gris">
                    Todavía nadie ha respondido. ¡Sé el primero!
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filas.map((f) => {
                        const soyYo = String(f.id) === sesion.user.id;
                        return (
                            <div
                                key={f.id}
                                className={
                                    "tarjeta flex items-center gap-4 " +
                                    (soyYo ? "border-azul bg-azul-claro" : "")
                                }
                            >
                                <span className="w-10 text-center text-2xl font-extrabold text-gris">
                                    {medallas[f.posicion - 1] ?? f.posicion}
                                </span>
                                <span className="flex-1">
                                    <span className="block font-extrabold">
                                        {f.usuario}
                                        {soyYo && " (tú)"}
                                    </span>
                                    <span className="text-sm text-gris">
                                        {f.respondidas}{" "}
                                        {f.respondidas === 1 ? "respondida" : "respondidas"}
                                    </span>
                                </span>
                                <span className="font-extrabold text-amarillo-oscuro">
                                    ⭐ {f.puntos}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}