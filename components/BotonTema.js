"use client";

import { useEffect, useState } from "react";

export default function BotonTema() {
    const [tema, setTema] = useState(null);

    useEffect(() => {
        setTema(
            document.documentElement.dataset.tema === "oscuro" ? "oscuro" : "claro"
        );
    }, []);

    function cambiar() {
        const nuevo = tema === "oscuro" ? "claro" : "oscuro";
        document.documentElement.dataset.tema = nuevo;
        try {
            localStorage.setItem("tema", nuevo);
        } catch { }
        setTema(nuevo);
    }

    return (
        <button
            type="button"
            onClick={cambiar}
            aria-label={
                tema === "oscuro" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl hover:bg-superficie"
        >
            {tema === null ? "" : tema === "oscuro" ? "☀️" : "🌙"}
        </button>
    );
}