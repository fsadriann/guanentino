import { COLORES, ICONOS } from "../lib/avatar";

export default function Avatar({ icono, color, inicial, size = 64 }) {
    const Icono = ICONOS[icono];
    const fondo = COLORES[color] ?? COLORES.azul;

    return (
        <span
            className={
                "flex shrink-0 items-center justify-center rounded-full border-b-4 border-black/25 font-extrabold text-white " +
                fondo
            }
            style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }}
        >
            {Icono ? <Icono size={Math.round(size * 0.5)} strokeWidth={2.5} /> : inicial}
        </span>
    );
}