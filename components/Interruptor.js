"use client";

export default function Interruptor({ activo, onCambio, deshabilitado, etiqueta }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={activo}
            aria-label={etiqueta}
            disabled={deshabilitado}
            onClick={() => onCambio(!activo)}
            className="interruptor-ui"
        >
            <span className="interruptor-bola" />
        </button>
    );
}