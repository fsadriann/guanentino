import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../auth";

export default async function Inicio() {
  const sesion = await auth();
  if (sesion) redirect("/pregunta");

  return (
    <main className="mx-auto max-w-xl p-6 text-center">
      <h1 className="mb-2 text-3xl font-bold">Guanentino Responda</h1>
      <p className="mb-6 opacity-70">
        Una pregunta al día para prepararte para las pruebas Saber 11.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/login" className="rounded bg-blue-600 px-4 py-2 text-white">
          Iniciar sesión
        </Link>
        <Link href="/registro" className="rounded border px-4 py-2">
          Crear cuenta
        </Link>
      </div>
    </main>
  );
}