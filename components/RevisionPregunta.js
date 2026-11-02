import { Check, X } from "lucide-react";
import { separarEnunciado } from "../lib/enunciado";
import Texto from "./Texto";
import ImagenPregunta from "./ImagenPregunta";

export default function RevisionPregunta({ pregunta, opcionElegidaId = null }) {
    const partes = separarEnunciado(pregunta.enunciado);

    return (
        <div>
            {partes.instruccion && (
                <p className="mb-2 text-sm font-extrabold uppercase tracking-wide text-gris">
                    <Texto>{partes.instruccion}</Texto>
                </p>
            )}

            {partes.texto && (
                <div className="tarjeta mb-3 bg-superficie text-sm leading-relaxed">
                    <Texto>{partes.texto}</Texto>
                </div>
            )}

            <ImagenPregunta id={pregunta.imagenId} alt={pregunta.imagenAlt} />

            <p className="mb-3 font-extrabold">
                <Texto>{partes.pregunta}</Texto>
            </p>

            <div className="flex flex-col gap-2">
                {pregunta.opciones.map((o, i) => {
                    const elegida = o.id === opcionElegidaId;
                    const clase = o.esCorrecta
                        ? "border-acierto bg-acierto-claro"
                        : elegida
                            ? "border-rojo bg-rojo-claro"
                            : opcionElegidaId === null
                                ? ""
                                : "opacity-60";
                    return (
                        <div
                            key={o.id}
                            className={"tarjeta flex items-center gap-3 py-3 " + clase}
                        >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-borde bg-fondo text-sm font-extrabold text-gris">
                                {"ABCD"[i]}
                            </span>
                            <span className="flex-1">
                                <Texto enLinea>{o.texto}</Texto>
                            </span>
                            {o.esCorrecta && (
                                <Check
                                    size={20}
                                    strokeWidth={3}
                                    className="shrink-0 text-acierto-oscuro"
                                />
                            )}
                            {elegida && !o.esCorrecta && (
                                <X size={20} strokeWidth={3} className="shrink-0 text-rojo-oscuro" />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 rounded-2xl bg-superficie p-4">
                <p className="mb-1 text-sm font-extrabold uppercase tracking-wide text-gris">
                    Explicación
                </p>
                <p>
                    <Texto>{pregunta.explicacion}</Texto>
                </p>
            </div>
        </div>
    );
}