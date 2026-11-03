"use client";

import { useEffect, useRef, useState } from "react";

export default function Revelar({ children, retraso = 0, className = "" }) {
    const ref = useRef(null);
    const [estado, setEstado] = useState("inicial");

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const posicion = el.getBoundingClientRect();
        if (posicion.top < window.innerHeight * 0.95) return;

        setEstado("oculto");
        const observador = new IntersectionObserver(
            ([entrada]) => {
                if (entrada.isIntersecting) {
                    setEstado("visible");
                    observador.disconnect();
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
        );
        observador.observe(el);
        return () => observador.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            data-estado={estado}
            style={{ "--retraso": retraso + "ms" }}
            className={"revelar " + className}
        >
            {children}
        </div>
    );
}