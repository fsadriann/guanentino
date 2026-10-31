import Link from "next/link";

export default function NoEncontrada() {
    return (
        <main className="mx-auto max-w-md p-6 text-center">
            <h1 className="mb-2 text-2xl font-bold">Página no encontrada</h1>
            <p className="mb-4 opacity-70">
                La dirección que buscas no existe o fue movida.
            </p>
            <Link href="/" className="rounded bg-blue-600 px-4 py-2 text-white">
                Ir al inicio
            </Link>
        </main>
    );
}