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
        <main className="mx-auto max-w-xl p-6">
            <EnlaceVolver href="/practica">Práctica libre</EnlaceVolver>
            <h1 className="mt-3 text-2xl font-extrabold">Simulacro</h1>
            <p className="mb-5 text-gris">
                Practica como en el examen, con preguntas de todas las áreas y un
                cronómetro.
            </p>

            {cantidad === 0 ? (
                <div className="tarjeta text-center text-gris">
                    Todavía no hay preguntas para un simulacro. Cada día se suman
                    las preguntas del día anterior, así que vuelve mañana.
                </div>
            ) : (
                <>
                    <ul className="tarjeta mb-6 flex flex-col gap-2 font-extrabold">
                        <li>{cantidad} preguntas de todas las áreas</li>
                        <li>{minutos} minutos en total</li>
                        <li>Verás las respuestas al terminar</li>
                        <li>No suma puntos al ranking</li>
                    </ul>

                    <form action={iniciarSimulacro}>
                        <button type="submit" className="boton boton-ancho">
                            Empezar
                        </button>
                    </form>
                    <p className="mt-3 text-center text-sm text-gris">
                        El tiempo empieza al pulsar Empezar.
                    </p>
                </>
            )}
        </main>
    );
}