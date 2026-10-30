import Link from "next/link";
import { auth } from "../auth";

export default async function Navbar() {
    const sesion = await auth();
    const esDocente = ["DOCENTE", "ADMIN"].includes(sesion?.user?.rol);

    const enlaces = sesion
        ? [
            ["/pregunta", "Pregunta del día"],
            ["/ranking", "Ranking"],
            ["/perfil", "Mi perfil"],
            ...(esDocente ? [["/docente", "Docente"]] : []),
        ]
        : [
            ["/login", "Iniciar sesión"],
            ["/registro", "Registrarme"],
        ];

    return (
        <header className="border-b">
            <nav className="mx-auto flex max-w-3xl flex-wrap items-center gap-4 p-4">
                <Link href={sesion ? "/pregunta" : "/"} className="mr-auto font-bold">
                    Guanentino Responda
                </Link>
                {enlaces.map(([ruta, texto]) => (
                    <Link key={ruta} href={ruta} className="hover:underline">
                        {texto}
                    </Link>
                ))}
            </nav>
        </header>
    );
}