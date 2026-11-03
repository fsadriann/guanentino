import Link from "next/link";
import { Medal, Star, Trophy } from "lucide-react";
import Avatar from "../../components/Avatar";
import { exigirSesion } from "../../lib/permisos";
import { posicionUsuario, topRanking } from "../../services/ranking";

const coloresMedalla = ["text-amarillo", "text-gris", "text-naranja"];

export default async function Ranking() {
    const sesion = await exigirSesion();
    const usuarioId = Number(sesion.user.id);
    const [filas, miPosicion] = await Promise.all([
        topRanking(10),
        posicionUsuario(usuarioId),
    ]);
    const estaEnTop = filas.some((fila) => fila.id === usuarioId);

    return (
        <main className="animar-entrada mx-auto max-w-xl p-6">
            <h1 className="text-2xl font-extrabold">Ranking</h1>
            <p className="mb-5 text-gris">Los 10 estudiantes con más puntos esta semana</p>

            {miPosicion && !estaEnTop && (
                <div className="animar-entrada tarjeta mb-6 flex items-center gap-3 border-azul bg-azul-claro">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-azul font-extrabold text-white">
                        {miPosicion.posicion}
                    </span>
                    <span className="flex-1">
                        <span className="block font-extrabold">Tu posición</span>
                        <span className="text-sm text-gris">
                            {miPosicion.diferenciaAnterior > 0
                                ? "Te separan " +
                                  miPosicion.diferenciaAnterior +
                                  " puntos de la posición anterior."
                                : "Estás empatado en puntos con la posición anterior."}
                        </span>
                    </span>
                    <span className="font-extrabold text-azul-oscuro">
                        <span className="block text-lg">{miPosicion.puntos}</span>
                        <span className="block text-xs uppercase tracking-wide">puntos</span>
                    </span>
                </div>
            )}

            {filas.length === 0 ? (
                <div className="tarjeta text-center">
                    <Trophy
                        size={42}
                        strokeWidth={2}
                        className="mx-auto mb-3 text-amarillo-oscuro"
                    />
                    <p className="font-extrabold">El ranking comienza contigo</p>
                    <p className="mt-1 text-sm text-gris">
                        Responde una pregunta para aparecer aquí y sumar tus primeros puntos.
                    </p>
                    <Link href="/pregunta" className="boton mt-4">
                        Responder una pregunta
                    </Link>
                </div>
            ) : (
                <div className="animar-lista flex flex-col gap-3">
                    {filas.map((f) => {
                        const soyYo = String(f.id) === sesion.user.id;
                        const clasePosicion =
                            f.posicion === 1
                                ? "border-amarillo"
                                : f.posicion === 2
                                    ? "border-gris"
                                    : f.posicion === 3
                                        ? "border-naranja"
                                        : "";
                        return (
                            <div
                                key={f.id}
                                className={
                                    "tarjeta flex items-center gap-3 " +
                                    (soyYo
                                        ? "border-azul bg-azul-claro"
                                        : clasePosicion)
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
                                    size={f.posicion <= 3 ? 48 : 44}
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

            {filas.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <Link href="/progreso" className="boton boton-ancho boton-secundario">
                        Ver mi progreso
                    </Link>
                    <Link href="/practica" className="boton boton-ancho boton-azul">
                        Practicar
                    </Link>
                </div>
            )}
        </main>
    );
}