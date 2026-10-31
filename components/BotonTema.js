"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function BotonTema() {
    const [oscuro, setOscuro] = useState(false);

    useEffect(() => {
        setOscuro(document.documentElement.dataset.tema === "oscuro");
    }, []);

    function cambiar() {
        const nuevo = oscuro ? "claro" : "oscuro";
        document.documentElement.dataset.tema = nuevo;
        try {
            localStorage.setItem("tema", nuevo);
        } catch { }
        setOscuro(!oscuro);
    }

    return (
        <button
            type="button"
            role="switch"
            aria-checked={oscuro}
            aria-label="Modo oscuro"
            onClick={cambiar}
            className="interruptor"
        >
            <span className="interruptor-bola">
                <Sun size={14} strokeWidth={3} className="icono-sol" />
                <Moon size={14} strokeWidth={3} className="icono-luna" />
            </span>
        </button>
    );
}