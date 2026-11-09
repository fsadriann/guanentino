import Link from "next/link";
import { Check, X } from "lucide-react";
import Texto from "./Texto";
import FormularioReporte from "../app/pregunta/[areaId]/formulario-reporte";

export default function BannerRetroalimentacion({
    acierto,
    titulo = acierto ? "¡Correcto!" : "Solución:",
    subtitulo,
    explicacion,
    preguntaId,
    yaReportado = false,
    textoBoton = "CONTINUAR",
    enlaceContinuar,
    botonAccion,
}) {
    const esVerde = Boolean(acierto);

    return (
        <div
            className={
                "sticky bottom-0 -mx-6 mt-6 p-4 sm:p-5 animar-entrada " +
                (esVerde
                    ? "bg-acierto-claro text-acierto-oscuro"
                    : "bg-rojo-claro text-rojo-oscuro")
            }
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <span
                            className={
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white " +
                                (esVerde ? "bg-acierto" : "bg-rojo")
                            }
                        >
                            {esVerde ? (
                                <Check size={16} strokeWidth={3.5} />
                            ) : (
                                <X size={16} strokeWidth={3.5} />
                            )}
                        </span>
                        <div>
                            <h2 className="text-lg font-black tracking-wide leading-none">
                                {titulo}
                            </h2>
                            {subtitulo && (
                                <p className="mt-1 text-xs font-extrabold opacity-85 leading-none">
                                    {subtitulo}
                                </p>
                            )}
                        </div>
                    </div>

                    {preguntaId && (
                        <div className="flex shrink-0 items-center">
                            <FormularioReporte
                                preguntaId={preguntaId}
                                yaReportado={yaReportado}
                                compacto
                            />
                        </div>
                    )}
                </div>

                {explicacion && (
                    <div className="flex flex-col gap-1 text-sm font-semibold">
                        <p className="text-xs font-extrabold uppercase tracking-wider opacity-75">
                            Explicación
                        </p>
                        <div className="max-h-32 overflow-y-auto leading-relaxed">
                            <Texto>{explicacion}</Texto>
                        </div>
                    </div>
                )}

                <div className="pt-1">
                    {enlaceContinuar ? (
                        <Link
                            href={enlaceContinuar}
                            prefetch
                            className={
                                "boton boton-ancho py-3.5 tracking-wider uppercase " +
                                (esVerde ? "boton-acierto" : "boton-rojo")
                            }
                        >
                            {textoBoton}
                        </Link>
                    ) : (
                        botonAccion
                    )}
                </div>
            </div>
        </div>
    );
}
