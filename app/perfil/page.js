import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleCheck, Flame, Settings, Star, Trophy } from "lucide-react";
import { signOut } from "../../auth";
import Avatar from "../../components/Avatar";
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
        {
            Icono: Star,
            lleno: true,
            titulo: "Puntos",
            valor: stats.puntos,
            color: "text-amarillo-oscuro",
        },
        {
            Icono: Trophy,
            lleno: false,
            titulo: "Posición",
            valor: usuario.ocultoEnRanking
                ? "Oculto"
                : stats.posicion
                    ? "#" + stats.posicion
                    : "-",
            color: "text-morado",
        },
        {
            Icono: Flame,
            lleno: true,
            titulo: "Racha",
            valor: stats.racha + (stats.racha === 1 ? " día" : " días"),
            color: "text-naranja-oscuro",
        },
        {
            Icono: CircleCheck,
            lleno: false,
            titulo: "Aciertos",
            valor: stats.aciertos + " de " + stats.respondidas,
            color: "text-acierto-oscuro",
        },
    ];

    return (
        <main className="mx-auto max-w-xl p-6">
            <div className="mb-6 flex items-center gap-4">
                <Avatar
                    icono={usuario.avatarIcono}
                    color={usuario.avatarColor}
                    inicial={usuario.nombre.charAt(0).toUpperCase()}
                    size={72}
                />
                <div>
                    <h1 className="text-2xl font-extrabold">
                        {usuario.nombre} {usuario.apellido}
                    </h1>
                    <p className="text-gris">
                        @{usuario.usuario}
                        {usuario.colegio ? " · " + usuario.colegio : ""}
                    </p>
                    {esDocente && (
                        <span className="mt-1 inline-block rounded-full bg-relleno-morado px-3 py-1 text-xs font-extrabold text-white">
                            DOCENTE
                        </span>
                    )}
                </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3">
                {tarjetas.map((t) => (
                    <div key={t.titulo} className="tarjeta">
                        <t.Icono
                            size={28}
                            strokeWidth={2.5}
                            fill={t.lleno ? "currentColor" : "none"}
                            className={t.color}
                        />
                        <p className={"mt-1 text-2xl font-extrabold " + t.color}>{t.valor}</p>
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
                <Link
                    href="/perfil/configuracion"
                    className="boton boton-secundario boton-ancho gap-2"
                >
                    <Settings size={18} strokeWidth={2.5} /> Configuración
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