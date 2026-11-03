"use client";

export default function EnlaceSuave({ destino, children, className = "" }) {
    function alPulsar(e) {
        const el = document.getElementById(destino);
        if (!el) return;
        e.preventDefault();
        const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "start" });
    }

    return (
        <a href={"/#" + destino} onClick={alPulsar} className={className}>
            {children}
        </a>
    );
}