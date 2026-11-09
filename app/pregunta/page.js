import Link from "next/link";
import { exigirSesion } from "../../lib/permisos";
import { prisma } from "../../lib/prisma";
import { estiloArea } from "../../lib/areas";
import { preguntaDelDia } from "../../services/preguntas";
import { Check, Dumbbell, PartyPopper, X } from "lucide-react";
import BarraProgreso from "../../components/BarraProgreso";

export default async function Preguntas() {
    const sesion = await exigirSesion();

    const areas = await prisma.area.findMany({ orderBy: { id: "asc" } });
    const delDia = await Promise.all(areas.map((a) => preguntaDelDia(a.id)));

    const ids = delDia.filter(Boolean).map((p) => p.id);
    const respuestas = await prisma.respuesta.findMany({
        where: { usuarioId: Number(sesion.user.id), preguntaId: { in: ids } },
        select: { preguntaId: true, acierto: true },
    });
    const porPregunta = new Map(respuestas.map((r) => [r.preguntaId, r]));

    const disponibles = ids.length;
    const hechas = respuestas.length;
    const terminado = disponibles > 0 && hechas === disponibles;

    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="mb-4 text-2xl font-extrabold">Preguntas del día</h1>

            <BarraProgreso
                hechas={hechas}
                total={disponibles}
                etiqueta="Progreso de hoy"
            />

            <Link href="/practica" className="tarjeta mb-6 flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-azul-claro text-azul">
                    <Dumbbell size={24} strokeWidth={2.5} />
                </span>
                <span className="flex-1">
                    <span className="block text-lg font-extrabold">Práctica libre</span>
                    <span className="text-sm text-gris">
                        Repasa preguntas o haz simulacros
                    </span>
                </span>
            </Link>

            {terminado && (
                <div className="mensaje-ok animar-entrada mb-6 flex items-center gap-3">
                    <PartyPopper size={30} strokeWidth={2.5} className="shrink-0" />
                    <div>
                        <p className="font-extrabold">¡Terminaste las preguntas de hoy!</p>
                        <p className="text-sm">
                            Mañana habrá preguntas nuevas.{" "}
                            <Link href="/practica" className="underline">
                                Sigue con la práctica libre
                            </Link>{" "}
                            o{" "}
                            <Link href="/ranking" className="underline">
                                mira el ranking
                            </Link>
                        </p>
                    </div>
                </div>
            )}

            <div className="animar-lista flex flex-col gap-3">
                {areas.map((area, i) => {
                    const pregunta = delDia[i];
                    const estilo = estiloArea(area.nombre);
                    const Icono = estilo.Icono;
                    const respuesta = pregunta ? porPregunta.get(pregunta.id) : null;

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
                            <span className="flex-1">
                                <span className="block text-lg font-extrabold">{area.nombre}</span>
                                {!pregunta ? (
                                    <span className="text-sm text-gris">Pronto habrá preguntas</span>
                                ) : !respuesta ? (
                                    <span className="text-sm font-extrabold text-azul">EMPEZAR</span>
                                ) : respuesta.acierto ? (
                                    <span className="flex items-center gap-1 text-sm font-extrabold text-acierto-oscuro">
                                        <Check size={16} strokeWidth={3} /> CORRECTA
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-sm font-extrabold text-rojo-oscuro">
                                        <X size={16} strokeWidth={3} /> FALLASTE
                                    </span>
                                )}
                            </span>
                        </>
                    );

                    if (!pregunta) {
                        return (
                            <div key={area.id} className="tarjeta flex items-center gap-4 opacity-50">
                                {contenido}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={area.id}
                            href={"/pregunta/" + area.id}
                            className="tarjeta flex items-center gap-4"
                        >
                            {contenido}
                        </Link>
                    );
                })}
            </div>
        </main>
    );
}