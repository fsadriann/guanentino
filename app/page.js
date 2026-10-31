import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../auth";

export default async function Inicio() {
  const sesion = await auth();
  if (sesion) redirect("/pregunta");

  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-extrabold text-primario">
        Guanentino Responda
      </h1>
      <p className="text-lg text-gris">
        Una pregunta al día en cada área para prepararte para las pruebas Saber 11.
      </p>
      <div className="flex w-full flex-col gap-3">
        <Link href="/registro" className="boton boton-ancho">
          Empezar
        </Link>
        <Link href="/login" className="boton boton-secundario boton-ancho">
          Ya tengo cuenta
        </Link>
      </div>
    </main>
  );
}