import { redirect } from "next/navigation";
import { auth, signOut } from "../../auth";

export default async function Perfil() {
    const sesion = await auth();
    if (!sesion) redirect("/login");

    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="text-2xl font-bold">Hola {sesion.user.name}</h1>
            <form
                action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                }}
            >
                <button className="mt-4 rounded bg-blue-600 p-2 text-white">
                    Cerrar sesión
                </button>
            </form>
        </main>
    );
}