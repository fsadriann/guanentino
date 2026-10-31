import { Medal, Star } from "lucide-react";
import Avatar from "../../components/Avatar";
import { exigirSesion } from "../../lib/permisos";
import { topRanking } from "../../services/ranking";

const coloresMedalla = ["text-amarillo", "text-gris", "text-naranja"];

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
                <div className="animar-lista flex flex-col gap-3">
                    {filas.map((f) => {
                        const soyYo = String(f.id) === sesion.user.id;
                        return (
                            <div
                                key={f.id}
                                className={
                                    "tarjeta flex items-center gap-3 " +
                                    (soyYo ? "border-azul bg-azul-claro" : "")
                                }
                            >
                                <span className="flex w-9 justify-center text-xl font-extrabold text-gris">
                                    {f.posicion <= 3 ? (
                                        <Medal
                                            size={30}
                                            strokeWidth={2.5}
                                            className={coloresMedalla[f.posicion - 1]}
                                        />
                                    ) : (
                                        f.posicion
                                    )}
                                </span>
                                <Avatar
                                    icono={f.avatarIcono}
                                    color={f.avatarColor}
                                    inicial={f.usuario.charAt(0).toUpperCase()}
                                    size={44}
                                />
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
                                <span className="flex items-center gap-1 font-extrabold text-amarillo-oscuro">
                                    <Star size={18} strokeWidth={2.5} fill="currentColor" />
                                    {f.puntos}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}