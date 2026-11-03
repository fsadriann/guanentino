import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  Dumbbell,
  FileQuestion,
  Flag,
  Flame,
  GraduationCap,
  Sigma,
  Smartphone,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { auth } from "../auth";
import { estiloArea } from "../lib/areas";
import Revelar from "../components/landing/Revelar";
import EfectosScroll from "../components/landing/EfectosScroll";
import EnlaceSuave from "../components/landing/EnlaceSuave";
import PreguntaDemo from "../components/landing/PreguntaDemo";

const PASOS = [
  [
    BookOpenCheck,
    "Elige un área",
    "Escoge entre lectura, matemáticas, sociales, inglés y ciencias o incluso todas juntas para un repaso más completo.",
  ],
  [
    CheckCircle2,
    "Responde y aprende",
    "Cada día una pregunta nueva de cada área. Al comprobar sabes si acertaste y entiendes el porqué con la explicación de cada pregunta.",
  ],
  [
    TrendingUp,
    "Mide tu progreso",
    "Suma puntos, mantén tu racha diaria y haz un seguimiento de tu avance en cada área.",
  ],
];

const AREAS = [
  ["Lectura crítica", "Entiende textos, saca conclusiones y evalúa argumentos."],
  ["Matemáticas", "Resuelve problemas con números, geometría y datos."],
  ["Sociales y ciudadanas", "Conoce tu país, su historia y cómo convivir en sociedad."],
  ["Ciencias naturales", "Explora la vida, la materia y la energía."],
  ["Inglés", "Lee, completa y comprende textos en inglés."],
];

const FUNCIONES = [
  [Flame, "Racha diaria", "Practica un poco cada día y no rompas tu racha."],
  [Trophy, "Ranking", "Compite con tus compañeros en el top semanal."],
  [TrendingUp, "Tu progreso", "Realiza un seguimiento de tu aprendizaje y repasa donde fallaste."],
  [Dumbbell, "Práctica libre", "Repasa preguntas de días anteriores cuando quieras."],
  [Sigma, "Fórmulas e imágenes", "Preguntas de matemáticas y ciencias con fórmulas, gráficos e imágenes."],
  [Smartphone, "App en tu teléfono", "Fácil de instalar y utilizar como cualquier app."],
];

export default async function Inicio({ searchParams }) {
  const sesion = await auth();
  if (sesion) redirect("/pregunta");

  const { cuenta } = await searchParams;

  return (
    <>
      <EfectosScroll />

      <section className="landing-seccion relative overflow-x-clip">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="paralaje absolute -left-24 top-10 h-72 w-72 rounded-full bg-relleno-primario/20 blur-3xl"
            style={{ "--vel": 0.12 }}
          />
          <div
            className="paralaje absolute -right-20 top-48 h-80 w-80 rounded-full bg-relleno-rosa/20 blur-3xl"
            style={{ "--vel": 0.06 }}
          />
        </div>

        <div className="relative mx-auto grid max-w-5xl items-center gap-12 px-6 py-12 md:grid-cols-2 md:py-20">
          <div className="animar-entrada text-center md:text-left">
            {cuenta === "eliminada" && (
              <p className="mensaje-ok mb-6">
                Tu cuenta fue eliminada. Gracias por haber participado.
              </p>
            )}

            <span className="mb-4 inline-flex rounded-full bg-primario-claro px-4 py-1.5 text-sm font-extrabold text-primario">
              Guanentino Responda
            </span>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl">
              Practica para las Pruebas Saber 11 con{" "}
              <span className="text-primario">una pregunta al día</span>
            </h1>
            <p className="mb-8 text-lg text-gris">
              Responde y aprende de una forma fácil y entretenida.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link href="/registro" className="boton">
                Empezar
              </Link>
              <Link href="/login" className="boton boton-secundario">
                Ya tengo cuenta
              </Link>
            </div>

            <ul className="mt-7 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-extrabold text-gris md:justify-start">
              {[
                "Cinco áreas del examen",
                "Una pregunta nueva cada día",
                "Explicación de cada respuesta",
              ].map((beneficio) => (
                <li key={beneficio} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="shrink-0 text-acierto" strokeWidth={2.5} />
                  {beneficio}
                </li>
              ))}
            </ul>

            <EnlaceSuave
              destino="como-funciona"
              className="mt-6 inline-flex items-center gap-1 text-sm font-extrabold text-azul"
            >
              Ver cómo funciona <ChevronDown size={18} strokeWidth={3} />
            </EnlaceSuave>
          </div>

          <div className="relative">
            <PreguntaDemo />
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        className="landing-seccion scroll-mt-14 border-y-2 border-borde bg-superficie"
      >
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Revelar>
            <h2 className="mb-2 text-center text-3xl font-extrabold">Así funciona</h2>
            <p className="mb-10 text-center text-gris">
              Tres pasos y listo, sin complicaciones.
            </p>
          </Revelar>

          <div className="relative z-10 grid gap-4 md:grid-cols-3">
            {PASOS.map(([Icono, titulo, texto], i) => (
              <Revelar key={titulo} retraso={i * 120} className="h-full">
                <div className="tarjeta landing-card h-full min-h-44">
                  <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primario-claro text-primario">
                    <Icono size={25} strokeWidth={2.5} />
                  </span>
                  <h3 className="mb-1 text-xl font-extrabold">{titulo}</h3>
                  <p className="text-gris">{texto}</p>
                </div>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      <section id="areas" className="landing-seccion mx-auto max-w-5xl scroll-mt-14 px-6 py-16">
        <Revelar>
          <h2 className="mb-2 text-center text-3xl font-extrabold">
            Practica las cinco áreas del examen
          </h2>
          <p className="mb-10 text-center text-gris">
            Una pregunta nueva cada día.
          </p>
        </Revelar>

        <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {AREAS.map(([nombre, texto], i) => {
            const estilo = estiloArea(nombre);
            const Icono = estilo.Icono;
            return (
              <Revelar
                key={nombre}
                retraso={i * 90}
                className={
                  "h-full lg:col-span-2 " +
                  (i === 3 ? "lg:col-start-2" : i === 4 ? "lg:col-start-4" : "")
                }
              >
                <div className="tarjeta landing-card h-full min-h-40">
                  <span
                    className={
                      "mb-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-b-4 text-white " +
                      estilo.circulo
                    }
                  >
                    <Icono size={24} strokeWidth={2.5} />
                  </span>
                  <span>
                    <span className="block text-lg font-extrabold">{nombre}</span>
                    <span className="mt-1 block text-gris">{texto}</span>
                  </span>
                </div>
              </Revelar>
            );
          })}
        </div>
        <Revelar className="mt-8">
          <div className="flex flex-col items-center justify-center gap-2 text-center text-sm font-extrabold text-gris sm:flex-row">
            <CheckCircle2 size={18} className="text-acierto" strokeWidth={2.5} />
            <span className="max-w-sm sm:max-w-none sm:whitespace-nowrap">
              Practica todas las áreas o enfócate en la que más necesitas.
            </span>
          </div>
        </Revelar>
      </section>

      <section className="landing-seccion border-y-2 border-borde bg-superficie">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Revelar>
            <h2 className="mb-2 text-center text-3xl font-extrabold">
              Todo lo que necesitas para practicar
            </h2>
            <p className="mb-10 text-center text-gris">
              Pensada para que estudiar se sienta como un juego.
            </p>
          </Revelar>

          <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FUNCIONES.map(([Icono, titulo, texto], i) => (
              <Revelar key={titulo} retraso={(i % 3) * 100} className="h-full">
                <div className="tarjeta landing-card h-full min-h-40">
                  <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-azul-claro text-azul">
                    <Icono size={24} strokeWidth={2.5} />
                  </span>
                  <h3 className="mb-1 text-lg font-extrabold">{titulo}</h3>
                  <p className="text-gris">{texto}</p>
                </div>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-seccion mx-auto max-w-5xl px-6 py-16">
        <Revelar>
          <div className="mb-10 flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-azul-claro text-azul">
              <GraduationCap size={30} strokeWidth={2.5} />
            </span>
            <h2 className="text-3xl font-extrabold">Herramientas para docentes</h2>
            <p className="max-w-2xl text-gris">
              Crea mejores experiencias de práctica y acompaña el avance de tus estudiantes desde un solo lugar.
            </p>
          </div>
        </Revelar>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            [FileQuestion, "Banco de preguntas", "Crea, edita y organiza preguntas por área y dificultad."],
            [Users, "Seguimiento", "Consulta los estudiantes registrados y observa su avance."],
            [Flag, "Reportes", "Atiende los reportes para mantener preguntas claras y útiles."],
          ].map(([Icono, titulo, texto], i) => (
            <Revelar key={titulo} retraso={i * 100} className="h-full">
              <div className="tarjeta landing-card h-full min-h-44">
                <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-azul-claro text-azul">
                  <Icono size={25} strokeWidth={2.5} />
                </span>
                <h3 className="mb-1 text-lg font-extrabold">{titulo}</h3>
                <p className="text-gris">{texto}</p>
              </div>
            </Revelar>
          ))}
        </div>

        <Revelar className="mt-8 text-center">
          <Link href="/login" className="boton boton-secundario">
            Acceder al panel docente
          </Link>
        </Revelar>
      </section>

      <section className="landing-seccion mx-auto max-w-5xl px-6 pb-20">
        <Revelar>
          <div
            className="rounded-3xl bg-relleno-primario px-6 py-12 text-center text-white"
            style={{ borderBottom: "6px solid var(--b-primario-sombra)" }}
          >
            <h2 className="mb-2 text-3xl font-extrabold">
              ¿Listo para tu primera pregunta?
            </h2>
            <p className="mx-auto mb-8 max-w-md text-white/90">
              Crea tu cuenta en un minuto y empieza hoy.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/registro" className="boton boton-secundario">
                Crear mi cuenta
              </Link>
              <Link href="/login" className="px-4 py-2 font-extrabold underline">
                Ya tengo cuenta
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/80">
              Al registrarte aceptas la{" "}
              <Link href="/privacidad" className="font-extrabold underline">
                política de privacidad
              </Link>
              .
            </p>
          </div>
        </Revelar>
      </section>
    </>
  );
}