import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import Formulario from "./formulario";

export default async function Clave() {
    const sesion = await auth();
    if (!sesion) redirect("/login");

    return (
        <main className="mx-auto max-w-md p-6">
            <h1 className="mb-4 text-2xl font-bold">Cambiar clave</h1>
            <Formulario />
        </main>
    );
}