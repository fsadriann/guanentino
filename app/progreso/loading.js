import Esqueleto from "../../components/Esqueleto";

export default function Cargando() {
    return (
        <main className="mx-auto max-w-xl p-6" aria-busy="true">
            <span className="sr-only" role="status">
                Cargando tu progreso
            </span>
            <Esqueleto className="mb-2 h-8 w-1/2" />
            <Esqueleto className="mb-6 h-4 w-2/3" />
            <div className="tarjeta mb-6">
                <Esqueleto className="mb-3 h-4 w-1/3" />
                <Esqueleto className="mb-3 h-4" />
                <Esqueleto className="h-4 w-3/4" />
            </div>
            <div className="tarjeta mb-6">
                <Esqueleto className="mb-2 h-6 w-1/3" />
                <Esqueleto className="mb-4 h-4 w-2/3" />
                <div className="grid grid-cols-2 gap-3">
                    <Esqueleto className="h-16" />
                    <Esqueleto className="h-16" />
                </div>
            </div>
            <div className="tarjeta mb-6 flex h-[76px] items-center gap-3">
                <Esqueleto className="h-11 w-11 shrink-0 rounded-full" />
                <div className="flex-1">
                    <Esqueleto className="mb-2 h-4 w-1/3" />
                    <Esqueleto className="h-3 w-2/3" />
                </div>
                <Esqueleto className="h-8 w-16" />
            </div>
            <Esqueleto className="mb-3 h-7 w-1/4" />
            <div className="flex flex-col gap-3">
                {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="tarjeta">
                        <Esqueleto className="mb-3 h-5 w-2/3" />
                        <Esqueleto className="mb-2 h-3" />
                        <Esqueleto className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </main>
    );
}