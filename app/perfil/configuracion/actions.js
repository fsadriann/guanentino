"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";
import { exigirSesion } from "../../../lib/permisos";
import { signOut } from "../../../auth";
import { CLAVES_COLORES, CLAVES_ICONOS } from "../../../lib/avatar";
import {
    estaBloqueado,
    limpiarFallos,
    MENSAJE_BLOQUEO,
    registrarFallo,
} from "../../../lib/intentos";

const esquemaPerfil = z.object({
    nombre: z.string().trim().min(1, "Escribe tu nombre").max(50, "El nombre es muy largo"),
    apellido: z.string().trim().min(1, "Escribe tu apellido").max(50, "El apellido es muy largo"),
    colegio: z.string().trim().max(100, "El nombre del colegio es muy largo"),
    avatarIcono: z.enum(["", ...CLAVES_ICONOS], { message: "Ícono no válido" }),
    avatarColor: z.enum(CLAVES_COLORES, { message: "Color no válido" }),
});

export async function guardarPerfil(estadoPrevio, formData) {
    const sesion = await exigirSesion();

    const datos = esquemaPerfil.safeParse({
        nombre: formData.get("nombre") ?? "",
        apellido: formData.get("apellido") ?? "",
        colegio: formData.get("colegio") ?? "",
        avatarIcono: formData.get("avatarIcono") ?? "",
        avatarColor: formData.get("avatarColor") ?? "azul",
    });
    if (!datos.success) return { error: datos.error.issues[0].message };
    const { nombre, apellido, colegio, avatarIcono, avatarColor } = datos.data;

    await prisma.usuario.update({
        where: { id: Number(sesion.user.id) },
        data: {
            nombre,
            apellido,
            colegio: colegio || null,
            avatarIcono: avatarIcono || null,
            avatarColor,
        },
    });

    revalidatePath("/perfil");
    revalidatePath("/perfil/configuracion");
    revalidatePath("/ranking");
    return { ok: "Cambios guardados" };
}

const esquemaCorreo = z.object({
    correo: z.string().trim().email("Correo no válido"),
    clave: z.string().min(1, "Escribe tu clave actual"),
});

export async function cambiarCorreo(estadoPrevio, formData) {
    const sesion = await exigirSesion();

    const datos = esquemaCorreo.safeParse({
        correo: formData.get("correo") ?? "",
        clave: formData.get("clave") ?? "",
    });
    if (!datos.success) return { error: datos.error.issues[0].message };
    const { correo, clave } = datos.data;

    const id = Number(sesion.user.id);
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) return { error: "No se encontró tu cuenta" };

    if (await estaBloqueado(usuario.usuario)) return { error: MENSAJE_BLOQUEO };

    const coincide = await bcrypt.compare(clave, usuario.clave);
    if (!coincide) {
        await registrarFallo(usuario.usuario);
        return { error: "La clave actual no es correcta" };
    }

    if (correo === usuario.correo) return { error: "Ese ya es tu correo" };

    const existe = await prisma.usuario.findFirst({
        where: { correo, NOT: { id } },
    });
    if (existe) return { error: "Ese correo ya está registrado" };

    await prisma.usuario.update({ where: { id }, data: { correo } });
    await limpiarFallos(usuario.usuario);

    revalidatePath("/perfil/configuracion");
    return { ok: "Correo actualizado" };
}

export async function guardarVisibilidad(visible) {
    const sesion = await exigirSesion();
    if (typeof visible !== "boolean") return { error: "Valor no válido" };

    await prisma.usuario.update({
        where: { id: Number(sesion.user.id) },
        data: { ocultoEnRanking: !visible },
    });

    revalidatePath("/perfil");
    revalidatePath("/ranking");
    return { ok: true };
}

export async function eliminarCuenta(estadoPrevio, formData) {
    const sesion = await exigirSesion();
    const id = Number(sesion.user.id);

    const confirmacion = String(formData.get("confirmacion") ?? "")
        .trim()
        .toUpperCase();
    const clave = String(formData.get("clave") ?? "");
    if (confirmacion !== "ELIMINAR") {
        return { error: "Escribe ELIMINAR para confirmar" };
    }
    if (!clave) return { error: "Escribe tu clave actual" };

    const usuario = await prisma.usuario.findUnique({ where: { id } });
    if (!usuario) return { error: "No se encontró tu cuenta" };
    if (usuario.rol !== "ESTUDIANTE") {
        return { error: "Las cuentas de docente no se pueden eliminar desde aquí" };
    }

    if (await estaBloqueado(usuario.usuario)) return { error: MENSAJE_BLOQUEO };

    const coincide = await bcrypt.compare(clave, usuario.clave);
    if (!coincide) {
        await registrarFallo(usuario.usuario);
        return { error: "La clave actual no es correcta" };
    }

    await prisma.$transaction([
        prisma.reportePregunta.deleteMany({ where: { usuarioId: id } }),
        prisma.respuesta.deleteMany({ where: { usuarioId: id } }),
        prisma.intentoLogin.deleteMany({ where: { usuario: usuario.usuario } }),
        prisma.usuario.delete({ where: { id } }),
    ]);

    revalidatePath("/ranking");
    await signOut({ redirectTo: "/?cuenta=eliminada" });
}