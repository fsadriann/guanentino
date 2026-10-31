"use server";

import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { signIn } from "../../auth";
import { prisma } from "../../lib/prisma";

const MAX_POR_USUARIO = 5;
const MAX_POR_IP = 50;
const VENTANA_MS = 15 * 60 * 1000;

export async function iniciarSesion(estadoPrevio, formData) {
    const usuario = String(formData.get("usuario") ?? "").slice(0, 50);
    const clave = String(formData.get("clave") ?? "");

    const cabeceras = await headers();
    const ip = (cabeceras.get("x-forwarded-for") ?? "local").split(",")[0].trim();

    const desde = new Date(Date.now() - VENTANA_MS);
    const [porUsuario, porIp] = await Promise.all([
        prisma.intentoLogin.count({ where: { usuario, fecha: { gte: desde } } }),
        prisma.intentoLogin.count({ where: { ip, fecha: { gte: desde } } }),
    ]);
    if (porUsuario >= MAX_POR_USUARIO || porIp >= MAX_POR_IP) {
        return { error: "Demasiados intentos fallidos. Espera 15 minutos e intenta de nuevo" };
    }

    try {
        await signIn("credentials", { usuario, clave, redirectTo: "/perfil" });
    } catch (error) {
        if (error instanceof AuthError) {
            await prisma.intentoLogin.create({ data: { usuario, ip } });
            await prisma.intentoLogin.deleteMany({
                where: { fecha: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
            });
            return { error: "Usuario o clave incorrectos" };
        }
        throw error;
    }
}