import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { prisma } from "../../lib/prisma";
import { preguntaDelDia } from "../../services/preguntas";
import { responder } from "./actions";

export default async function Pregunta() {
    const sesion = await auth();
    if (!sesion) redirect("/login");

    const pregunta = await preguntaDelDia();
    if (!pregunta) {
        return <main className="p-6">Todavía no hay preguntas cargadas.</main>;
    }

    const respuesta = await prisma.respuesta.findUnique({
        where: {
            usuarioId_preguntaId: {
                usuarioId: Number(sesion.user.id),
                preguntaId: pregunta.id,
            },
        },
    });

    return (
        <main className="mx-auto max-w-xl p-6">
            <p className="text-sm opacity-70">{pregunta.area.nombre}</p>
            <h1 className="mb-4 text-2xl font-bold">{pregunta.enunciado}</h1>

            {!respuesta ? (
                <form action={responder} className="flex flex-col gap-2">
                    {pregunta.opciones.map((o) => (
                        <label key={o.id} className="flex gap-2 rounded border p-3">
                            <input type="radio" name="opcionId" value={o.id} required />
                            {o.texto}
                        </label>
                    ))}
                    <button className="mt-2 rounded bg-blue-600 p-2 text-white">
                        Responder
                    </button>
                </form>
            ) : (
                <div className="flex flex-col gap-2">
                    {pregunta.opciones.map((o) => (
                        <div
                            key={o.id}
                            className={
                                "rounded border p-3 " +
                                (o.esCorrecta
                                    ? "border-green-600"
                                    : o.id === respuesta.opcionId
                                        ? "border-red-600"
                                        : "")
                            }
                        >
                            {o.texto}
                        </div>
                    ))}
                    <p className="mt-2 font-bold">
                        {respuesta.acierto ? "Correcto" : "Incorrecto"} y ganaste{" "}
                        {respuesta.puntaje} puntos
                    </p>
                    <p>{pregunta.explicacion}</p>
                </div>
            )}
        </main>
    );
}