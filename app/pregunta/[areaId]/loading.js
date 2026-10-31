import Esqueleto from "../../../components/Esqueleto";

export default function Cargando() {
    return (
        <main className="mx-auto max-w-xl p-6" aria-busy="true">
            <span className="sr-only" role="status">
                Cargando la pregunta
            </span>
            <div className="mb-6 flex items-center gap-3">
                <Esqueleto className="h-8 w-8" />
                <Esqueleto className="h-8 w-40 rounded-full" />
            </div>
            <Esqueleto className="mb-3 h-8 w-full" />
            <Esqueleto className="mb-6 h-8 w-2/3" />
            <div className="flex flex-col gap-3">
                {[0, 1, 2, 3].map((i) => (
                    <Esqueleto key={i} className="h-[70px]" />
                ))}
            </div>
        </main>
    );
}