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
        <main className="mx-auto max-w-sm p-6">
            <h1 className="mb-6 text-center text-2xl font-extrabold">Cambiar clave</h1>

            {usuario?.debeCambiarClave && (
                <p className="tarjeta mb-4 border-amarillo bg-superficie font-bold">
                    🔑 Tu clave fue restablecida. Debes crear una clave nueva para seguir
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
                <button className="mt-6 w-full text-sm font-extrabold text-gris underline">
                    Cerrar sesión
                </button>
            </form>
        </main>
    );
}