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
            ["/pregunta", "Preguntas", "preguntas"],
            ["/ranking", "Ranking", "ranking"],
            ["/progreso", "Progreso", "progreso"],
            ["/perfil", "Perfil", "perfil"],
            ...(esDocente ? [["/docente", "Docente", "docente"]] : []),
        ]
        : [
            ["/login", "Entrar"],
            ["/registro", "Registro"],
        ];

    return (
        <>
            <header className="sticky top-0 z-50 border-b-2 border-borde bg-fondo">
                <nav className="mx-auto flex max-w-3xl flex-nowrap items-center gap-x-2 px-3 py-3 sm:px-4">
                    <Link
                        href={sesion ? "/pregunta" : "/"}
                        className="mr-auto text-lg font-extrabold text-primario sm:text-xl"
                    >
                        {sesion ? (
                            "Guanentino Responda"
                        ) : (
                            <>
                                <span className="sm:hidden">Guanentino</span>
                                <span className="hidden sm:inline">Guanentino Responda</span>
                            </>
                        )}
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