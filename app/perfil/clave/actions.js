"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";

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

    const coincide = await bcrypt.compare(actual, usuario.clave);
    if (!coincide) return { error: "La clave actual no es correcta" };
    if (actual === nueva) return { error: "La clave nueva debe ser distinta" };

    await prisma.usuario.update({
        where: { id },
        data: { clave: await bcrypt.hash(nueva, 10) },
    });
    return { ok: "Clave cambiada" };
}