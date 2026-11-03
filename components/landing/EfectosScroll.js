"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function EfectosScroll() {
    const barra = useRef(null);
    const [mostrarSubir, setMostrarSubir] = useState(false);
    const [altoNavbar, setAltoNavbar] = useState(0);

    useEffect(() => {
        function actualizarAltoNavbar() {
            const navbar = document.querySelector("header");
            if (navbar) setAltoNavbar(navbar.getBoundingClientRect().height);
        }

        const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let pendiente = false;

        function actualizar() {
            pendiente = false;
            const y = window.scrollY;
            const alto = document.documentElement.scrollHeight - window.innerHeight;
            const avance = alto > 0 ? Math.min(1, y / alto) : 0;

            if (barra.current) barra.current.style.transform = "scaleX(" + avance + ")";
            setMostrarSubir(y > 700);
            if (!reducir) {
                document.documentElement.style.setProperty("--scroll", String(Math.round(y)));
            }
        }

        function alDesplazar() {
            if (pendiente) return;
            pendiente = true;
            requestAnimationFrame(actualizar);
        }

        actualizar();
        actualizarAltoNavbar();
        window.addEventListener("scroll", alDesplazar, { passive: true });
        window.addEventListener("resize", alDesplazar);
        window.addEventListener("resize", actualizarAltoNavbar);
        return () => {
            window.removeEventListener("scroll", alDesplazar);
            window.removeEventListener("resize", alDesplazar);
            window.removeEventListener("resize", actualizarAltoNavbar);
            document.documentElement.style.removeProperty("--scroll");
        };
    }, []);

    function subir() {
        const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reducir ? "auto" : "smooth" });
    }

    return (
        <>
            <div
                aria-hidden="true"
                className="fixed inset-x-0 z-40 h-1"
                style={{ top: altoNavbar }}
            >
                <div
                    ref={barra}
                    className="h-full origin-left bg-relleno-primario"
                    style={{ transform: "scaleX(0)" }}
                />
            </div>

            <button
                type="button"
                aria-label="Volver arriba"
                onClick={subir}
                className={
                    "fixed bottom-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border-b-4 border-black/25 bg-relleno-primario text-white transition duration-300 " +
                    (mostrarSubir
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-4 opacity-0")
                }
            >
                <ArrowUp size={22} strokeWidth={3} />
            </button>
        </>
    );
}