"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, ListChecks, Trophy, User } from "lucide-react";

const iconos = {
    preguntas: ListChecks,
    ranking: Trophy,
    perfil: User,
    docente: GraduationCap,
};

export default function NavInferior({ enlaces }) {
    const ruta = usePathname();

    if (/^\/pregunta\/\d+/.test(ruta)) return null;

    return (
        <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t-2 border-borde bg-fondo md:hidden">
            {enlaces.map(([href, texto, icono]) => {
                const activo = ruta === href || ruta.startsWith(href + "/");
                const Icono = iconos[icono];
                return (
                    <Link
                        key={href}
                        href={href}
                        className={
                            "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-extrabold uppercase " +
                            (activo ? "text-azul" : "text-gris")
                        }
                    >
                        <span
                            className={
                                "flex h-9 w-12 items-center justify-center rounded-xl border-2 " +
                                (activo ? "border-azul bg-azul-claro" : "border-transparent")
                            }
                        >
                            {Icono && <Icono size={22} strokeWidth={2.5} />}
                        </span>
                        {texto}
                    </Link>
                );
            })}
        </nav>
    );
}