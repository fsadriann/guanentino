"use client";

import { useEffect, useId, useRef } from "react";

export default function Hoja({ abierto, onCerrar, titulo, children }) {
    const ref = useRef(null);
    const idTitulo = useId();

    useEffect(() => {
        const dialogo = ref.current;
        if (!dialogo) return;
        if (abierto && !dialogo.open) dialogo.showModal();
        if (!abierto && dialogo.open) dialogo.close();
    }, [abierto]);

    return (
        <dialog
            ref={ref}
            aria-labelledby={idTitulo}
            onClose={onCerrar}
            onClick={(e) => {
                if (e.target === ref.current) onCerrar();
            }}
            className="hoja"
        >
            <div className="p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-borde md:hidden" />
                <h2 id={idTitulo} className="mb-3 text-xl font-extrabold">
                    {titulo}
                </h2>
                {children}
            </div>
        </dialog>
    );
}