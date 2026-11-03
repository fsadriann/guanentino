import Link from "next/link";
import { Shuffle, Timer } from "lucide-react";
import { exigirSesion } from "../../../lib/permisos";
import { prisma } from "../../../lib/prisma";
import { estiloArea } from "../../../lib/areas";
import EnlaceVolver from "../../../components/EnlaceVolver";
import { poolTotal, resumenHoy } from "../../../services/practica";

export default async function Practica({ searchParams }) {
    const sesion = await exigirSesion();
    const { limite } = await searchParams;

    const [areas, pool, resumen, respuestas] = await Promise.all([
        prisma.area.findMany({ orderBy: { id: "asc" } }),
        poolTotal(),
        resumenHoy(Number(sesion.user.id)),
        prisma.respuesta.findMany({
            where: { usuarioId: Number(sesion.user.id), acierto: false },
            select: { pregunta: { select: { areaId: true } } },
        }),
    ]);

    const conteo = new Map();
    for (const p of pool) conteo.set(p.areaId, (conteo.get(p.areaId) ?? 0) + 1);
    const fallos = new Map();
    for (const r of respuestas) {
        const areaId = r.pregunta.areaId;
        fallos.set(areaId, (fallos.get(areaId) ?? 0) + 1);
    }

    function texto(n) {
        return n + (n === 1 ? " pregunta" : " preguntas");
    }

    function textoFallos(n) {
        return n + " para repasar";
    }

    return (
        <main className="mx-auto max-w-xl p-6">
            <EnlaceVolver href="/pregunta">Preguntas del día</EnlaceVolver>
            <h1 className="mt-3 text-2xl font-extrabold">Práctica libre</h1>
            <p className="mb-5 text-gris">
                Repasa preguntas de días anteriores. La práctica no suma puntos al
                ranking. Primero aparecen las que aún no has respondido y luego las
                que has fallado.
            </p>

            {(limite || resumen.llegoAlLimite) && (
                <p className="mensaje-error mb-4">
                    Llegaste al límite de práctica de hoy. Descansa y vuelve mañana.
                </p>
            )}

            {resumen.total > 0 && (
                <p className="mb-4 text-sm font-extrabold text-gris">
                    Hoy llevas {resumen.total} de práctica y {resumen.aciertos}{" "}
                    {resumen.aciertos === 1 ? "correcta" : "correctas"}
                </p>
            )}

            {pool.length === 0 ? (
                <div className="tarjeta text-center text-gris">
                    Todavía no hay preguntas para practicar. Cada día se suman las
                    preguntas del día anterior, así que vuelve mañana.
                </div>
            ) : (
                <div className="animar-lista flex flex-col gap-3">
                    <Link href="/practica/simulacro" className="tarjeta flex items-center gap-4">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-b-4 border-black/25 bg-relleno-azul text-white">
                            <Timer size={26} strokeWidth={2.5} />
                        </span>
                        <span>
                            <span className="block text-lg font-extrabold">Simulacro</span>
                            <span className="text-sm text-gris">Con cronómetro, como en el examen</span>
                        </span>
                    </Link>
                    <Link href="/practica/todas" className="tarjeta flex items-center gap-4">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-b-4 border-black/25 bg-relleno-primario text-white">
                            <Shuffle size={26} strokeWidth={2.5} />
                        </span>
                        <span>
                            <span className="block text-lg font-extrabold">Todas las áreas</span>
                            <span className="text-sm text-gris">
                                {texto(pool.length)}
                                {respuestas.length > 0 &&
                                    " · " + textoFallos(respuestas.length)}
                            </span>
                        </span>
                    </Link>

                    {areas.map((area) => {
                        const estilo = estiloArea(area.nombre);
                        const Icono = estilo.Icono;
                        const cantidad = conteo.get(area.id) ?? 0;
                        const cantidadFallos = fallos.get(area.id) ?? 0;

                        const contenido = (
                            <>
                                <span
                                    className={
                                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-b-4 text-white " +
                                        estilo.circulo
                                    }
                                >
                                    <Icono size={26} strokeWidth={2.5} />
                                </span>
                                <span>
                                    <span className="block text-lg font-extrabold">{area.nombre}</span>
                                    <span className="text-sm text-gris">
                                        {cantidad > 0
                                            ? texto(cantidad) +
                                            (cantidadFallos > 0
                                                ? " · " + textoFallos(cantidadFallos)
                                                : "")
                                            : "Aún no hay preguntas"}
                                    </span>
                                </span>
                            </>
                        );

                        return cantidad > 0 ? (
                            <Link
                                key={area.id}
                                href={"/practica/" + area.id}
                                className="tarjeta flex items-center gap-4"
                            >
                                {contenido}
                            </Link>
                        ) : (
                            <div
                                key={area.id}
                                className="tarjeta flex items-center gap-4 opacity-50"
                            >
                                {contenido}
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
