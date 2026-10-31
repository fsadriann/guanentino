"use client";

export default function Error({ reset }) {
    return (
        <main className="mx-auto max-w-md p-6 text-center">
            <h1 className="mb-2 text-2xl font-bold">Algo salió mal</h1>
            <p className="mb-4 opacity-70">
                Tuvimos un problema al cargar esta página. Intenta de nuevo.
            </p>
            <button
                onClick={() => reset()}
                className="rounded bg-blue-600 px-4 py-2 text-white"
            >
                Reintentar
            </button>
        </main>
    );
}
