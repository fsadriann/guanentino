"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { exigirDocente } from "../../../lib/permisos";

const letras = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function claveTemporal() {
    return Array.from(randomBytes(10), (b) => letras[b % letras.length]).join("");
}

export async function restablecerClave(estadoPrevio, formData) {
    const docente = await exigirDocente();
    const id = Number(formData.get("usuarioId"));

    const objetivo = await prisma.usuario.findUnique({ where: { id } });
    if (!objetivo) return { error: "No existe ese usuario" };
    if (objetivo.rol !== "ESTUDIANTE" && docente.rol !== "ADMIN") {
        return { error: "Solo puedes restablecer claves de estudiantes" };
    }

    const clave = claveTemporal();
    await prisma.usuario.update({
        where: { id },
        data: { clave: await bcrypt.hash(clave, 10), debeCambiarClave: true },
    });
    return { clave };
}

export async function eliminarEstudiante(estadoPrevio, formData) {
    await exigirDocente();
    const id = Number(formData.get("usuarioId"));
    const confirmacion = String(formData.get("confirmacion") ?? "").trim();

    const objetivo = await prisma.usuario.findUnique({ where: { id } });
    if (!objetivo) return { error: "No existe ese usuario" };
    if (objetivo.rol !== "ESTUDIANTE") {
        return { error: "Solo se pueden eliminar cuentas de estudiantes" };
    }
    if (confirmacion !== objetivo.usuario) {
        return { error: "El usuario escrito no coincide" };
    }

    await prisma.$transaction([
        prisma.reportePregunta.deleteMany({ where: { usuarioId: id } }),
        prisma.respuesta.deleteMany({ where: { usuarioId: id } }),
        prisma.intentoLogin.deleteMany({ where: { usuario: objetivo.usuario } }),
        prisma.usuario.delete({ where: { id } }),
    ]);

    revalidatePath("/docente/estudiantes");
    revalidatePath("/docente");
    revalidatePath("/ranking");
    return { ok: "Cuenta eliminada" };
}