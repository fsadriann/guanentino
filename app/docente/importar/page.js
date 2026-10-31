import Link from "next/link";
import { exigirDocente } from "../../../lib/permisos";
import Formulario from "./formulario";

const ejemplo = `[
  {
    "area": "Matemáticas",
    "enunciado": "Texto de la pregunta",
    "opciones": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "correcta": "B",
    "explicacion": "Por qué esa es la respuesta correcta"
  }
]`;

export default async function Importar() {
    await exigirDocente();

    return (
        <main className="mx-auto max-w-xl p-6">
            <Link href="/docente" className="text-sm font-extrabold text-azul">
                ← Panel del docente
            </Link>
            <h1 className="my-4 text-2xl font-extrabold">Importar preguntas</h1>
            <p className="mb-2">
                Sube un archivo JSON con una lista de preguntas. Si hay un solo error no
                se carga ninguna. Las preguntas repetidas se omiten.
            </p>
            <p className="mb-5 text-gris">
                Revisa siempre las respuestas correctas antes de abrir las preguntas a
                los estudiantes.
            </p>

            <Formulario />

            <h2 className="mb-2 mt-8 text-xl font-extrabold">Formato del archivo</h2>
            <pre className="overflow-x-auto rounded-2xl border-2 border-borde bg-superficie p-3 text-sm">
                {ejemplo}
            </pre>
        </main>
    );
}