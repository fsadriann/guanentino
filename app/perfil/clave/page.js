import { redirect } from "next/navigation";
import { auth, signOut } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import Formulario from "./formulario";

export default async function Clave() {
    const sesion = await auth();
    if (!sesion) redirect("/login");

    const usuario = await prisma.usuario.findUnique({
        where: { id: Number(sesion.user.id) },
        select: { debeCambiarClave: true },
    });

    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="mb-4 text-2xl font-bold">Cambiar clave</h1>

            {usuario?.debeCambiarClave && (
                <p className="mb-4 rounded border border-yellow-600 p-3">
                    Tu clave fue restablecida. Debes crear una clave nueva para seguir
                    usando la plataforma.
                </p>
            )}

            <Formulario />

            <form
                action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                }}
            >
                <button className="mt-6 text-sm underline opacity-70">
                    Cerrar sesión
                </button>
            </form>
        </main>
    );
}