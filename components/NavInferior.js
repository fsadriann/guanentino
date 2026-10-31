"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavInferior({ enlaces }) {
    const ruta = usePathname();

    if (/^\/pregunta\/\d+/.test(ruta)) return null;

    return (
        <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t-2 border-borde bg-white md:hidden">
            {enlaces.map(([href, texto, emoji]) => {
                const activo = ruta === href || ruta.startsWith(href + "/");
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
                                "flex h-9 w-12 items-center justify-center rounded-xl border-2 text-xl " +
                                (activo ? "border-azul bg-azul-claro" : "border-transparent")
                            }
                        >
                            {emoji}
                        </span>
                        {texto}
                    </Link>
                );
            })}
        </nav>
    );
}