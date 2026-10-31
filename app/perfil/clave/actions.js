"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import {
    estaBloqueado,
    limpiarFallos,
    MENSAJE_BLOQUEO,
    registrarFallo,
} from "../../../lib/intentos";

const esquema = z
    .object({
        actual: z.string().min(1, "Escribe tu clave actual"),
        nueva: z.string().min(8, "La clave nueva debe tener mínimo 8 caracteres"),
        repetir: z.string(),
    })
    .refine((d) => d.nueva === d.repetir, {
        message: "Las claves nuevas no coinciden",
        path: ["repetir"],
    });

export async function cambiarClave(estadoPrevio, formData) {
    const sesion = await auth();
    if (!sesion) return { error: "Debes iniciar sesión" };

    const datos = esquema.safeParse(Object.fromEntries(formData));
    if (!datos.success) return { error: datos.error.issues[0].message };
    const { actual, nueva } = datos.data;

    const id = Number(sesion.user.id);
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) return { error: "No se encontró tu cuenta" };

    if (await estaBloqueado(usuario.usuario)) return { error: MENSAJE_BLOQUEO };

    const coincide = await bcrypt.compare(actual, usuario.clave);
    if (!coincide) {
        await registrarFallo(usuario.usuario);
        return { error: "La clave actual no es correcta" };
    }
    if (actual === nueva) return { error: "La clave nueva debe ser distinta" };

    await prisma.usuario.update({
        where: { id },
        data: { clave: await bcrypt.hash(nueva, 10), debeCambiarClave: false },
    });
    await limpiarFallos(usuario.usuario);

    return { ok: "Clave cambiada" };
}