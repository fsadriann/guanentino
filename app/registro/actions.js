"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";

const esquema = z.object({
    usuario: z.string().min(3, "El usuario debe tener mínimo 3 caracteres"),
    nombre: z.string().min(1, "Escribe tu nombre"),
    apellido: z.string().min(1, "Escribe tu apellido"),
    correo: z.string().email("Correo no válido"),
    clave: z.string().min(8, "La clave debe tener mínimo 8 caracteres"),
    colegio: z.string().optional(),
});

export async function registrar(estadoPrevio, formData) {
    const datos = esquema.safeParse(Object.fromEntries(formData));
    if (!datos.success) {
        return { error: datos.error.issues[0].message };
    }
    const { usuario, nombre, apellido, correo, clave, colegio } = datos.data;

    const existe = await prisma.usuario.findFirst({
        where: { OR: [{ usuario }, { correo }] },
    });
    if (existe) {
        return { error: "Ese usuario o correo ya está registrado" };
    }

    const claveCifrada = await bcrypt.hash(clave, 10);
    await prisma.usuario.create({
        data: {
            usuario,
            nombre,
            apellido,
            correo,
            clave: claveCifrada,
            colegio: colegio || null,
        },
    });

    redirect("/login");
}