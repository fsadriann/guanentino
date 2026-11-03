import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { exigirSesion } from "../../lib/permisos";
import { prisma } from "../../lib/prisma";
import { estiloArea } from "../../lib/areas";
import BarraProgreso from "../../components/BarraProgreso";
import Racha from "../../components/Racha";
import { preguntaDelDia } from "../../services/preguntas";

function diaBogota(fecha) {
    return fecha.toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
}

function restarDias(fecha, dias) {
    const resultado = new Date(fecha + "T00:00:00.000Z");
    resultado.setUTCDate(resultado.getUTCDate() - dias);
    return resultado.toISOString().slice(0, 10);
}

function calcularRacha(respuestas, hoy) {
    const dias = [...new Set(respuestas.map((r) => diaBogota(r.fecha)))].sort();
    if (dias.length === 0) return { actual: 0, mejor: 0, respondioHoy: false };

    const diasSet = new Set(dias);
    const respondioHoy = diasSet.has(hoy);
    let inicioActual = respondioHoy ? hoy : restarDias(hoy, 1);
    let actual = 0;

    while (diasSet.has(inicioActual)) {
        actual++;
        inicioActual = restarDias(inicioActual, 1);
    }

    let mejor = 1;
    let consecutivos = 1;
    for (let i = 1; i < dias.length; i++) {
        if (dias[i - 1] === restarDias(dias[i], 1)) {
            consecutivos++;
            mejor = Math.max(mejor, consecutivos);
        } else {
            consecutivos = 1;
        }
    }

    return { actual, mejor, respondioHoy };
}

export default async function Progreso() {
    const sesion = await exigirSesion();
    const usuarioId = Number(sesion.user.id);

    const [areas, respuestas] = await Promise.all([
        prisma.area.findMany({ orderBy: { id: "asc" } }),
        prisma.respuesta.findMany({
            where: { usuarioId },
            select: {
                acierto: true,
                fecha: true,
                pregunta: { select: { areaId: true } },
            },
        }),
    ]);
    const preguntasDelDia = await Promise.all(areas.map((a) => preguntaDelDia(a.id)));
    const idsDelDia = preguntasDelDia.filter(Boolean).map((p) => p.id);
    const respuestasDeHoy = idsDelDia.length
        ? await prisma.respuesta.count({
            where: { usuarioId, preguntaId: { in: idsDelDia } },
        })
        : 0;

    const total = respuestas.length;
    const hoy = diaBogota(new Date());
    const inicioSemana = restarDias(hoy, 6);
    const respuestasSemana = respuestas.filter((r) => {
        const dia = diaBogota(r.fecha);
        return dia >= inicioSemana && dia <= hoy;
    });
    const aciertosSemana = respuestasSemana.filter((r) => r.acierto).length;
    const porcentajeSemana = respuestasSemana.length
        ? Math.round((aciertosSemana / respuestasSemana.length) * 100)
        : 0;
    const racha = calcularRacha(respuestas, hoy);
    const diasActivos = [...new Set(respuestas.map((r) => diaBogota(r.fecha)))];
    const porArea = areas.map((a) => {
        const delArea = respuestas.filter((r) => r.pregunta.areaId === a.id);
        const aciertos = delArea.filter((r) => r.acierto).length;
        return {
            area: a,
            total: delArea.length,
            aciertos,
            porcentaje: delArea.length
                ? Math.round((aciertos / delArea.length) * 100)
                : 0,
        };
    });

    const comparables = porArea.filter((p) => p.total >= 3);
    const masDebil =
        comparables.length >= 2
            ? comparables.reduce((a, b) => (b.porcentaje < a.porcentaje ? b : a))
            : null;
    const mostrarConsejo = masDebil && masDebil.porcentaje < 70;

    return (
        <main className="mx-auto max-w-xl p-6">
            <h1 className="text-2xl font-extrabold">Mi progreso</h1>
            <p className="mb-5 text-gris">Mira cómo vas en cada área</p>

            {idsDelDia.length > 0 && (
                <div className="tarjeta mb-6">
                    <BarraProgreso
                        hechas={respuestasDeHoy}
                        total={idsDelDia.length}
                        etiqueta="Meta de hoy"
                    />
                    <p className="text-sm text-gris">
                        {respuestasDeHoy === idsDelDia.length
                            ? "Completaste todas las áreas de hoy."
                            : "Responde una pregunta en cada área para completar tu meta."}
                    </p>
                </div>
            )}

            <div className="tarjeta mb-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-extrabold">Esta semana</h2>
                        <p className="text-sm text-gris">Tu constancia en los últimos 7 días</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-xl bg-superficie p-3">
                        <p className="text-xl font-extrabold">{respuestasSemana.length}</p>
                        <p className="text-xs font-extrabold uppercase tracking-wide text-gris">
                            Respondidas
                        </p>
                    </div>
                    <div className="rounded-xl bg-superficie p-3">
                        <p className="text-xl font-extrabold text-acierto-oscuro">
                            {porcentajeSemana}%
                        </p>
                        <p className="text-xs font-extrabold uppercase tracking-wide text-gris">
                            De aciertos
                        </p>
                    </div>
                </div>
            </div>

            <Racha
                actual={racha.actual}
                mejor={racha.mejor}
                respondioHoy={racha.respondioHoy}
                diasActivos={diasActivos}
                hoy={hoy}
            />

            {mostrarConsejo && (
                <div className="tarjeta mb-6 flex items-start gap-3 border-amarillo">
                    <Lightbulb
                        size={22}
                        strokeWidth={2.5}
                        className="mt-0.5 shrink-0 text-amarillo-oscuro"
                    />
                    <div className="flex-1">
                        <p>
                            Por ahora tu área más difícil es{" "}
                            <span className="font-extrabold">{masDebil.area.nombre}</span>{" "}
                            con {masDebil.porcentaje}% de aciertos. Vale la pena practicar
                            un poco más esa área.
                        </p>
                        <Link
                            href={"/practica/" + masDebil.area.id}
                            className="mt-2 inline-block text-sm font-extrabold text-azul hover:underline"
                        >
                            Practicar {masDebil.area.nombre}
                        </Link>
                    </div>
                </div>
            )}

            {total === 0 ? (
                <div className="tarjeta text-center">
                    <p className="mb-3 text-gris">
                        Todavía no has respondido preguntas. Cuando empieces, aquí verás tu
                        avance.
                    </p>
                    <Link href="/pregunta" className="boton">
                        Ir a las preguntas
                    </Link>
                </div>
            ) : (
                <>
                    <h2 className="mb-3 text-xl font-extrabold">Por área</h2>
                    <div className="animar-lista mb-6 flex flex-col gap-3">
                        {porArea.map((p) => {
                            const estilo = estiloArea(p.area.nombre);
                            const Icono = estilo.Icono;
                            return (
                                <div key={p.area.id} className="tarjeta">
                                    <div className="mb-2 flex items-center gap-3">
                                        <span
                                            className={
                                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-b-4 text-white " +
                                                estilo.circulo
                                            }
                                        >
                                            <Icono size={18} strokeWidth={2.5} />
                                        </span>
                                        <span className="flex-1 font-extrabold">{p.area.nombre}</span>
                                        <span className="font-extrabold">
                                            {p.total ? p.porcentaje + "%" : "-"}
                                        </span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-borde">
                                        <div
                                            className={"h-full rounded-full " + estilo.fondo}
                                            style={{ width: p.porcentaje + "%" }}
                                        />
                                    </div>
                                    <p className="mt-1 text-sm text-gris">
                                        {p.total
                                            ? p.aciertos + " de " + p.total + " correctas"
                                            : "Sin respuestas todavía"}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                </>
            )}
        </main>
    );
}