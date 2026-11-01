"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavEnlaces({ enlaces, className = "" }) {
    const ruta = usePathname();

    return (
        <div className={"flex-nowrap items-center gap-1 " + className}>
            {enlaces.map(([href, texto]) => {
                const activo = ruta === href || ruta.startsWith(href + "/");
                return (
                    <Link
                        key={href}
                        href={href}
                        className={
                            "whitespace-nowrap rounded-xl px-2 py-2 text-xs font-extrabold uppercase tracking-wide sm:px-3 sm:text-sm " +
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