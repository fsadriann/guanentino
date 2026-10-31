import Link from "next/link";
import { auth } from "../auth";
import NavEnlaces from "./NavEnlaces";
import NavInferior from "./NavInferior";
import BotonTema from "./BotonTema";

export default async function Navbar() {
    const sesion = await auth();
    const esDocente = ["DOCENTE", "ADMIN"].includes(sesion?.user?.rol);

    const enlaces = sesion
        ? [
            ["/pregunta", "Preguntas", "📝"],
            ["/ranking", "Ranking", "🏆"],
            ["/perfil", "Perfil", "👤"],
            ...(esDocente ? [["/docente", "Docente", "🧑‍🏫"]] : []),
        ]
        : [
            ["/login", "Entrar"],
            ["/registro", "Registro"],
        ];

    return (
        <>
            <header className="sticky top-0 z-10 border-b-2 border-borde bg-fondo">
                <nav className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
                    <Link
                        href={sesion ? "/pregunta" : "/"}
                        className="mr-auto text-xl font-extrabold text-primario"
                    >
                        Guanentino
                    </Link>
                    <NavEnlaces
                        enlaces={enlaces}
                        className={sesion ? "hidden md:flex" : "flex"}
                    />
                    <BotonTema />
                </nav>
            </header>
            {sesion && <NavInferior enlaces={enlaces} />}
        </>
    );
}