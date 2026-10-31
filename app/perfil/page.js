import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "../../auth";
import { exigirSesion } from "../../lib/permisos";
import { prisma } from "../../lib/prisma";
import { estadisticasUsuario } from "../../services/estadisticas";

export default async function Perfil() {
    const sesion = await exigirSesion();

    const id = Number(sesion.user.id);
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) redirect("/login");

    const stats = await estadisticasUsuario(id);
    const esDocente = ["DOCENTE", "ADMIN"].includes(usuario.rol);

    const tarjetas = [
        { emoji: "⭐", titulo: "Puntos", valor: stats.puntos, color: "text-amarillo-oscuro" },
        {
            emoji: "🏆",
            titulo: "Posición",
            valor: stats.posicion ? "#" + stats.posicion : "-",
            color: "text-morado",
        },
        {
            emoji: "🔥",
            titulo: "Racha",
            valor: stats.racha + (stats.racha === 1 ? " día" : " días"),
            color: "text-naranja-oscuro",
        },
        {
            emoji: "✅",
            titulo: "Aciertos",
            valor: stats.aciertos + " de " + stats.respondidas,
            color: "text-primario-oscuro",
        },
    ];

    return (
        <main className="mx-auto max-w-xl p-6">
            <div className="mb-6 flex items-center gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-b-4 border-azul-oscuro bg-azul text-3xl font-extrabold text-white">
                    {usuario.nombre.charAt(0).toUpperCase()}
                </span>
                <div>
                    <h1 className="text-2xl font-extrabold">
                        {usuario.nombre} {usuario.apellido}
                    </h1>
                    <p className="text-gris">
                        @{usuario.usuario}
                        {usuario.colegio ? " · " + usuario.colegio : ""}
                    </p>
                    {esDocente && (
                        <span className="mt-1 inline-block rounded-full bg-morado px-3 py-1 text-xs font-extrabold text-white">
                            DOCENTE
                        </span>
                    )}
                </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3">
                {tarjetas.map((t) => (
                    <div key={t.titulo} className="tarjeta">
                        <p className="text-2xl">{t.emoji}</p>
                        <p className={"text-2xl font-extrabold " + t.color}>{t.valor}</p>
                        <p className="text-sm font-extrabold uppercase tracking-wide text-gris">
                            {t.titulo}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                {esDocente && (
                    <Link href="/docente" className="boton boton-azul boton-ancho">
                        Panel del docente
                    </Link>
                )}
                <Link href="/perfil/clave" className="boton boton-secundario boton-ancho">
                    Cambiar clave
                </Link>
                <form
                    action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/login" });
                    }}
                >
                    <button className="boton boton-secundario boton-ancho text-rojo">
                        Cerrar sesión
                    </button>
                </form>
            </div>
        </main>
    );
}