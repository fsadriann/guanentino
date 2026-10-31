"use client";

import { useState, useTransition } from "react";
import Interruptor from "../../../components/Interruptor";
import { guardarVisibilidad } from "./actions";

export default function InterruptorRanking({ visibleInicial }) {
    const [visible, setVisible] = useState(visibleInicial);
    const [error, setError] = useState(null);
    const [pendiente, empezar] = useTransition();

    function cambiar(nuevo) {
        setVisible(nuevo);
        setError(null);
        empezar(async () => {
            const resultado = await guardarVisibilidad(nuevo);
            if (resultado?.error) {
                setVisible(!nuevo);
                setError(resultado.error);
            }
        });
    }

    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="font-extrabold">Aparecer en el ranking</p>
                    <p className="text-sm text-gris">
                        Si lo apagas, los demás estudiantes no verán tu usuario ni tus
                        puntos. Tus docentes sí los siguen viendo.
                    </p>
                </div>
                <Interruptor
                    activo={visible}
                    onCambio={cambiar}
                    deshabilitado={pendiente}
                    etiqueta="Aparecer en el ranking"
                />
            </div>
            {error && <p className="mensaje-error mt-3">{error}</p>}
        </div>
    );
}