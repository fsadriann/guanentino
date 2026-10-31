"use client";

import { useActionState, useState } from "react";
import Avatar from "../../../components/Avatar";
import { COLORES, ICONOS } from "../../../lib/avatar";
import { guardarPerfil } from "./actions";

export default function FormularioPerfil({ usuario }) {
    const [estado, accion, pendiente] = useActionState(guardarPerfil, null);
    const [icono, setIcono] = useState(usuario.avatarIcono ?? "");
    const [color, setColor] = useState(usuario.avatarColor);
    const [nombre, setNombre] = useState(usuario.nombre);

    return (
        <form action={accion} className="flex flex-col gap-4">
            <div className="flex justify-center">
                <Avatar
                    icono={icono}
                    color={color}
                    inicial={nombre.charAt(0).toUpperCase()}
                    size={88}
                />
            </div>

            <div>
                <p className="mb-2 text-sm font-extrabold uppercase tracking-wide text-gris">
                    Color
                </p>
                <div className="flex flex-wrap gap-3">
                    {Object.entries(COLORES).map(([clave, fondo]) => (
                        <label key={clave} className="cursor-pointer">
                            <input
                                type="radio"
                                name="avatarColor"
                                value={clave}
                                checked={color === clave}
                                onChange={() => setColor(clave)}
                                aria-label={clave}
                                className="peer sr-only"
                            />
                            <span
                                className={
                                    "block h-10 w-10 rounded-full peer-checked:ring-4 peer-checked:ring-texto/30 peer-focus-visible:ring-2 peer-focus-visible:ring-azul " +
                                    fondo
                                }
                            />
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <p className="mb-2 text-sm font-extrabold uppercase tracking-wide text-gris">
                    Ícono
                </p>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
                    <label className="cursor-pointer">
                        <input
                            type="radio"
                            name="avatarIcono"
                            value=""
                            checked={icono === ""}
                            onChange={() => setIcono("")}
                            aria-label="Mi inicial"
                            className="peer sr-only"
                        />
                        <span className="flex h-12 w-full items-center justify-center rounded-2xl border-2 border-borde text-lg font-extrabold text-gris peer-checked:border-azul peer-checked:bg-azul-claro peer-checked:text-azul peer-focus-visible:ring-2 peer-focus-visible:ring-azul">
                            {nombre.charAt(0).toUpperCase() || "A"}
                        </span>
                    </label>
                    {Object.entries(ICONOS).map(([clave, Icono]) => (
                        <label key={clave} className="cursor-pointer">
                            <input
                                type="radio"
                                name="avatarIcono"
                                value={clave}
                                checked={icono === clave}
                                onChange={() => setIcono(clave)}
                                aria-label={clave}
                                className="peer sr-only"
                            />
                            <span className="flex h-12 w-full items-center justify-center rounded-2xl border-2 border-borde text-gris peer-checked:border-azul peer-checked:bg-azul-claro peer-checked:text-azul peer-focus-visible:ring-2 peer-focus-visible:ring-azul">
                                <Icono size={22} strokeWidth={2.5} />
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <input
                name="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                autoComplete="given-name"
                className="campo"
                required
            />
            <input
                name="apellido"
                defaultValue={usuario.apellido}
                placeholder="Apellido"
                autoComplete="family-name"
                className="campo"
                required
            />
            <input
                name="colegio"
                defaultValue={usuario.colegio ?? ""}
                placeholder="Colegio (opcional)"
                className="campo"
            />

            {estado?.error && <p className="mensaje-error">{estado.error}</p>}
            {estado?.ok && <p className="mensaje-ok">{estado.ok}</p>}

            <button disabled={pendiente} className="boton boton-ancho">
                {pendiente ? "Guardando..." : "Guardar cambios"}
            </button>
        </form>
    );
}