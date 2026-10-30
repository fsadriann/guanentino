"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
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
        data: { clave: await bcrypt.hash(clave, 10) },
    });
    return { clave };
}