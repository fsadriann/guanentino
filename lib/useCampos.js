import { useState } from "react";

export function useCampos(inicial, calcularErrores) {
    const [valores, setValores] = useState(inicial);
    const [tocados, setTocados] = useState({});
    const [enfocado, setEnfocado] = useState(null);
    const [intento, setIntento] = useState(false);

    const errores = calcularErrores(valores);

    function propsDe(nombre, transformar, errorServidor) {
        const delServidor = errorServidor
            ? errorServidor(nombre, valores[nombre])
            : null;

        return {
            name: nombre,
            value: valores[nombre],
            onChange: (e) => {
                const nuevo = transformar ? transformar(e.target.value) : e.target.value;
                setValores((v) => ({ ...v, [nombre]: nuevo }));
            },
            onFocus: () => setEnfocado(nombre),
            onBlur: () => {
                setEnfocado((f) => (f === nombre ? null : f));
                setTocados((t) => ({ ...t, [nombre]: true }));
            },
            error: delServidor ?? errores[nombre],
            mostrarError: intento || Boolean(tocados[nombre]) || Boolean(delServidor),
        };
    }

    function alEnviar(e) {
        const primero = Object.keys(errores).find((c) => errores[c]);
        if (primero) {
            e.preventDefault();
            setIntento(true);
            e.currentTarget.elements[primero]?.focus();
        }
    }

    return { valores, enfocado, propsDe, alEnviar };
}