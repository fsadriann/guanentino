"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavEnlaces({ enlaces }) {
    const ruta = usePathname();

    return (
        <div className="flex flex-wrap items-center gap-1">
            {enlaces.map(([href, texto]) => {
                const activo = ruta === href || ruta.startsWith(href + "/");
                return (
                    <Link
                        key={href}
                        href={href}
                        className={
                            "rounded-xl px-3 py-2 text-sm font-extrabold uppercase tracking-wide " +
                            (activo
                                ? "bg-azul-claro text-azul"
                                : "text-gris hover:bg-superficie")
                        }
                    >
                        {texto}
                    </Link>
                );
            })}
        </div>
    );
}