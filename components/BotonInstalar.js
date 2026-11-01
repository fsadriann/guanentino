"use client";

import { useEffect, useState } from "react";
import { Download, Share, Smartphone } from "lucide-react";

export default function BotonInstalar() {
    const [listo, setListo] = useState(false);
    const [evento, setEvento] = useState(null);
    const [esIos, setEsIos] = useState(false);
    const [instalada, setInstalada] = useState(false);

    useEffect(() => {
        setInstalada(
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true
        );
        setEsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
        setListo(true);

        function antes(e) {
            e.preventDefault();
            setEvento(e);
        }
        function despues() {
            setInstalada(true);
            setEvento(null);
        }

        window.addEventListener("beforeinstallprompt", antes);
        window.addEventListener("appinstalled", despues);
        return () => {
            window.removeEventListener("beforeinstallprompt", antes);
            window.removeEventListener("appinstalled", despues);
        };
    }, []);

    async function instalar() {
        if (!evento) return;
        evento.prompt();
        await evento.userChoice;
        setEvento(null);
    }

    if (!listo) return null;

    if (instalada) {
        return (
            <div className="tarjeta flex items-center gap-3 text-sm text-gris">
                <Smartphone size={22} strokeWidth={2.5} className="shrink-0 text-acierto-oscuro" />
                Ya estás usando la app instalada.
            </div>
        );
    }

    if (evento) {
        return (
            <button onClick={instalar} className="boton boton-azul boton-ancho gap-2">
                <Download size={18} strokeWidth={2.5} /> Instalar la app
            </button>
        );
    }

    if (esIos) {
        return (
            <div className="tarjeta flex items-start gap-3 text-sm">
                <Share size={22} strokeWidth={2.5} className="mt-0.5 shrink-0 text-azul" />
                <p>
                    Para instalarla en tu iPhone abre esta página en <strong>Safari</strong>,
                    toca el botón <strong>Compartir</strong> y elige{" "}
                    <strong>Agregar a pantalla de inicio</strong>.
                </p>
            </div>
        );
    }

    return (
        <div className="tarjeta flex items-start gap-3 text-sm">
            <Smartphone size={22} strokeWidth={2.5} className="mt-0.5 shrink-0 text-azul" />
            <p>
                Para instalarla abre el menú de tu navegador y elige{" "}
                <strong>Instalar app</strong> o <strong>Agregar a la pantalla de inicio</strong>.
            </p>
        </div>
    );
}