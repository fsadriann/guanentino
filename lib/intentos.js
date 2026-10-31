import { headers } from "next/headers";
import { prisma } from "./prisma";

const MAX_FALLOS = 5;
const VENTANA_MS = 15 * 60 * 1000;

export const MENSAJE_BLOQUEO =
    "Demasiados intentos fallidos. Espera 15 minutos e intenta de nuevo";

export async function estaBloqueado(usuario) {
    const desde = new Date(Date.now() - VENTANA_MS);
    const fallos = await prisma.intentoLogin.count({
        where: { usuario, fecha: { gte: desde } },
    });
    return fallos >= MAX_FALLOS;
}

export async function registrarFallo(usuario) {
    const cabeceras = await headers();
    const ip = (cabeceras.get("x-forwarded-for") ?? "local").split(",")[0].trim();
    await prisma.intentoLogin.create({ data: { usuario, ip } });
}

export async function limpiarFallos(usuario) {
    await prisma.intentoLogin.deleteMany({ where: { usuario } });
}