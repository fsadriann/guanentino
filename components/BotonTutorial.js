"use client";

import { HelpCircle } from "lucide-react";

export default function BotonTutorial() {
    function abrir() {
        window.dispatchEvent(new Event("abrir-tutorial"));
    }

    return (
        <button
            type="button"
            onClick={abrir}
            className="boton boton-secundario boton-ancho gap-2"
        >
            <HelpCircle size={18} strokeWidth={2.5} /> Cómo funciona la app
        </button>
    );
}

