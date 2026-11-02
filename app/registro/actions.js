"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { validarRegistro } from "../../lib/validaciones";

export async function registrar(estadoPrevio, formData) {
    const crudos = {
        usuario: String(formData.get("usuario") ?? ""),
        nombre: String(formData.get("nombre") ?? ""),
        apellido: String(formData.get("apellido") ?? ""),
        correo: String(formData.get("correo") ?? ""),
        clave: String(formData.get("clave") ?? ""),
        colegio: String(formData.get("colegio") ?? ""),
    };

    const { errores, limpio } = validarRegistro(crudos);
    const primero = Object.values(errores)[0];
    if (primero) return { error: primero };

    const [usuarioTomado, correoTomado] = await Promise.all([
        prisma.usuario.findFirst({
            where: { usuario: { equals: limpio.usuario, mode: "insensitive" } },
            select: { id: true },
        }),
        prisma.usuario.findFirst({
            where: { correo: { equals: limpio.correo, mode: "insensitive" } },
            select: { id: true },
        }),
    ]);

    const duplicados = {};
    if (usuarioTomado) {
        duplicados.usuario = "Ese usuario ya está en uso, prueba con otro";
    }
    if (correoTomado) {
        duplicados.correo =
            "No pudimos usar este correo. Prueba con otro o inicia sesión";
    }
    if (Object.keys(duplicados).length > 0) {
        return {
            errores: duplicados,
            enviado: { usuario: crudos.usuario, correo: crudos.correo },
        };
    }

    try {
        await prisma.usuario.create({
            data: {
                usuario: limpio.usuario,
                nombre: limpio.nombre,
                apellido: limpio.apellido,
                correo: limpio.correo,
                clave: await bcrypt.hash(limpio.clave, 10),
                colegio: limpio.colegio || null,
            },
        });
    } catch {
        return { error: "No se pudo crear la cuenta. Intenta de nuevo" };
    }

    redirect("/login");
}