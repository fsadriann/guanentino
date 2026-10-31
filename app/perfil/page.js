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

    const tarjetas = [
        ["Puntos", stats.puntos],
        ["Posición", stats.posicion ? "#" + stats.posicion : "-"],
        ["Racha", stats.racha + (stats.racha === 1 ? " día" : " días")],
        ["Respondidas", stats.respondidas],
        ["Aciertos", stats.aciertos],
    ];

    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="text-2xl font-bold">
                {usuario.nombre} {usuario.apellido}
            </h1>
            <p className="mb-4 opacity-70">
                @{usuario.usuario}
                {usuario.colegio ? " · " + usuario.colegio : ""}
            </p>

            <div className="mb-6 grid grid-cols-2 gap-3">
                {tarjetas.map(([titulo, valor]) => (
                    <div key={titulo} className="rounded border p-3">
                        <p className="text-sm opacity-70">{titulo}</p>
                        <p className="text-2xl font-bold">{valor}</p>
                    </div>
                ))}
            </div>

            <nav className="mb-6 flex gap-4 text-blue-500 underline">
                <Link href="/pregunta">Pregunta del día</Link>
                <Link href="/ranking">Ranking</Link>
                <Link href="/perfil/clave">Cambiar clave</Link>
                {["DOCENTE", "ADMIN"].includes(usuario.rol) && (
                    <Link href="/docente">Panel docente</Link>
                )}
            </nav>

            <form
                action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                }}
            >
                <button className="rounded bg-blue-600 p-2 text-white">
                    Cerrar sesión
                </button>
            </form>
        </main>
    );
}