import Esqueleto from "../../../components/Esqueleto";

export default function Cargando() {
    return (
        <main className="mx-auto max-w-xl p-6" aria-busy="true">
            <span className="sr-only" role="status">
                Cargando la pregunta de práctica
            </span>
            <div className="mb-6 flex items-center gap-3">
                <Esqueleto className="h-7 w-7 rounded-full" />
                <Esqueleto className="h-7 w-32 rounded-full" />
            </div>
            <Esqueleto className="mb-6 h-4 w-full rounded-full" />
            <Esqueleto className="mb-4 h-20" />
            <Esqueleto className="mb-6 h-8 w-5/6" />
            <div className="flex flex-col gap-3">
                {[0, 1, 2, 3].map((i) => (
                    <Esqueleto key={i} className="h-[62px]" />
                ))}
            </div>
        </main>
    );
}
