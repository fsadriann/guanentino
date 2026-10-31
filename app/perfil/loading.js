import Esqueleto from "../../components/Esqueleto";

export default function Cargando() {
    return (
        <main className="mx-auto max-w-xl p-6" aria-busy="true">
            <span className="sr-only" role="status">
                Cargando tu perfil
            </span>
            <div className="mb-6 flex items-center gap-4">
                <Esqueleto className="h-16 w-16 shrink-0 rounded-full" />
                <div className="flex-1">
                    <Esqueleto className="mb-2 h-6 w-2/3" />
                    <Esqueleto className="h-4 w-1/2" />
                </div>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => (
                    <Esqueleto key={i} className="h-28" />
                ))}
            </div>
            <div className="flex flex-col gap-3">
                <Esqueleto className="h-12" />
                <Esqueleto className="h-12" />
            </div>
        </main>
    );
}