"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import EnlaceSuave from "./landing/EnlaceSuave";

export default function Footer() {
  const pathname = usePathname();

  if (pathname !== "/") {
    return null;
  }

  return (
    <footer className="border-t-2 border-borde bg-superficie py-8 md:py-6">
      <div className="mx-auto grid max-w-5xl gap-7 px-6 py-8 sm:grid-cols-2 sm:py-10 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-2 text-lg font-extrabold text-primario"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primario-claro">
              <Image
                src="/icons/icon-192.png"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 rounded-xl"
              />
            </span>
            Guanentino Responda
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-gris">
            Una pregunta al día para prepararte para las pruebas Saber 11,
            aprender de tus errores y seguir tu progreso.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide">
            Explora
          </h2>
          <div className="flex flex-col items-start gap-2 text-sm text-gris">
            <EnlaceSuave destino="como-funciona" className="hover:text-primario">
              Cómo funciona
            </EnlaceSuave>
            <EnlaceSuave destino="areas" className="hover:text-primario">
              Áreas del examen
            </EnlaceSuave>
            <Link href="/registro" className="hover:text-primario">
              Practicar gratis
            </Link>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide">
            Plataforma
          </h2>
          <div className="flex flex-col items-start gap-2 text-sm text-gris">
            <Link href="/login" className="hover:text-primario">
              Iniciar sesión
            </Link>
            <Link href="/privacidad" className="hover:text-primario">
              Política de privacidad
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-borde px-6 pt-5 text-center text-xs text-gris">
        © {new Date().getFullYear()} Guanentino Responda. Hecho para aprender
        con constancia.
      </div>
    </footer>
  );
}
