import { redirect } from "next/navigation";
import { KeyRound } from "lucide-react";
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
                <div className="tarjeta mb-4 flex items-start gap-3 border-amarillo bg-superficie font-bold">
                    <KeyRound
                        size={22}
                        strokeWidth={2.5}
                        className="mt-0.5 shrink-0 text-amarillo-oscuro"
                    />
                    <p>
                        Tu clave fue restablecida. Debes crear una clave nueva para seguir
                        usando la plataforma.
                    </p>
                </div>
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