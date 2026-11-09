import { exigirSesion } from "../../../lib/permisos";
import EnlaceVolver from "../../../components/EnlaceVolver";
import {
    SIMULACRO_MINUTOS,
    SIMULACRO_PREGUNTAS,
    preguntasDisponibles,
} from "../../../services/simulacros";
import { iniciarSimulacro } from "./actions";

export default async function Simulacro() {
    await exigirSesion();

    const disponibles = await preguntasDisponibles();
    const cantidad = Math.min(disponibles, SIMULACRO_PREGUNTAS);
    const minutos = Math.max(
        1,
        Math.round((SIMULACRO_MINUTOS * cantidad) / SIMULACRO_PREGUNTAS)
    );

    return (
        <main className="mx-auto flex max-w-xl flex-col p-6 pb-0 [min-height:calc(100dvh-5rem)] md:[min-height:calc(100dvh-7rem)]">
            <div className="flex-1">
                <EnlaceVolver href="/practica">Práctica libre</EnlaceVolver>
                <h1 className="mb-4 mt-3 text-2xl font-extrabold">Simulacro</h1>

                {cantidad === 0 ? (
                    <div className="tarjeta text-center text-gris">
                        Todavía no hay preguntas para un simulacro. Cada día se suman
                        las preguntas del día anterior, así que vuelve mañana.
                    </div>
                ) : (
                    <ul className="tarjeta flex flex-col gap-2 font-extrabold">
                        <li>{cantidad} preguntas de todas las áreas</li>
                        <li>{minutos} minutos en total</li>
                        <li>Verás las respuestas al terminar</li>
                        <li>No suma puntos al ranking</li>
                    </ul>
                )}
            </div>

            {cantidad > 0 && (
                <form action={iniciarSimulacro}>
                    <div className="-mx-6 mt-4 border-t-2 border-borde bg-fondo p-4">
                        <button type="submit" className="boton boton-ancho">
                            Empezar
                        </button>
                    </div>
                </form>
            )}
        </main>
    );
}