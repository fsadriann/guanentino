import Esqueleto from "../../../components/Esqueleto";

export default function Cargando() {
    return (
        <main className="mx-auto max-w-xl p-6" aria-busy="true">
            <span className="sr-only" role="status">
                Cargando la práctica
            </span>
            <Esqueleto className="mb-2 h-5 w-1/3" />
            <Esqueleto className="mb-2 h-8 w-2/3" />
            <Esqueleto className="mb-6 h-4 w-4/5" />
            <div className="flex flex-col gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <Esqueleto key={i} className="h-[82px]" />
                ))}
            </div>
        </main>
    );
}
