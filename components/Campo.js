"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Campo({
    etiqueta,
    name,
    value,
    onChange,
    onBlur,
    onFocus,
    error,
    mostrarError,
    ayuda,
    type = "text",
    autoComplete,
    autoCapitalize,
    spellCheck,
    maxLength,
    inputMode,
    requerido = true,
    children,
}) {
    const id = useId();
    const [visible, setVisible] = useState(false);
    const esClave = type === "password";
    const hayError = Boolean(mostrarError && error);
    const correcto = Boolean(mostrarError && !error && value.length > 0);
    const borde = hayError ? "border-rojo" : correcto ? "border-acierto" : "";

    return (
        <div>
            <label htmlFor={id} className="mb-1 block text-sm font-extrabold">
                {etiqueta}
                {!requerido && (
                    <span className="font-semibold text-gris"> (opcional)</span>
                )}
            </label>

            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={esClave && visible ? "text" : type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    autoComplete={autoComplete}
                    autoCapitalize={autoCapitalize}
                    spellCheck={esClave ? false : spellCheck}
                    maxLength={maxLength}
                    inputMode={inputMode}
                    aria-invalid={hayError}
                    aria-describedby={id + "-mensaje"}
                    className={"campo " + (esClave ? "pr-12 " : "") + borde}
                />
                {esClave && (
                    <button
                        type="button"
                        onClick={() => setVisible((v) => !v)}
                        aria-label={visible ? "Ocultar clave" : "Mostrar clave"}
                        aria-pressed={visible}
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gris hover:text-texto"
                    >
                        {visible ? (
                            <EyeOff size={20} strokeWidth={2.5} />
                        ) : (
                            <Eye size={20} strokeWidth={2.5} />
                        )}
                    </button>
                )}
            </div>

            <div id={id + "-mensaje"} aria-live="polite" className="mt-1 text-sm">
                {hayError ? (
                    <p className="font-bold text-rojo-oscuro">{error}</p>
                ) : ayuda ? (
                    <p className="text-gris">{ayuda}</p>
                ) : null}
            </div>

            {children}
        </div>
    );
}