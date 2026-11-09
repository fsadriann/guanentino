"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, ListChecks, Trophy, TrendingUp, User } from "lucide-react";

const iconos = {
    preguntas: ListChecks,
    ranking: Trophy,
    perfil: User,
    docente: GraduationCap,
    progreso: TrendingUp,
};

export default function NavInferior({ enlaces }) {
    const ruta = usePathname();

    if (/^\/(pregunta\/\d+|practica)/.test(ruta)) return null;

    return (
        <nav className="fixed inset-x-0 bottom-0 z-10 flex min-h-16 border-t-2 border-borde bg-fondo pb-[env(safe-area-inset-bottom)] md:hidden">
            {enlaces.map(([href, texto, icono]) => {
                const activo = ruta === href || ruta.startsWith(href + "/");
                const Icono = iconos[icono];
                return (
                    <Link
                        key={href}
                        href={href}
                        aria-label={texto}
                        aria-current={activo ? "page" : undefined}
                        title={texto}
                        className={
                            "flex flex-1 items-center justify-center py-3 transition-colors duration-200 " +
                            (activo ? "text-azul" : "nav-icono-inactivo hover:text-azul")
                        }
                    >
                        <span
                            className={
                                "flex h-10 w-12 items-center justify-center rounded-xl border-2 transition duration-200 ease-out " +
                                (activo
                                    ? "scale-105 border-azul bg-azul-claro"
                                    : "border-transparent")
                            }
                        >
                            {Icono && <Icono size={22} strokeWidth={activo ? 2.5 : 2} />}
                        </span>
                        <span className="sr-only">{texto}</span>
                    </Link>
                );
            })}
        </nav>
    );
}