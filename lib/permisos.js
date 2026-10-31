import { redirect } from "next/navigation";
import { auth } from "../auth";
import { prisma } from "./prisma";

export async function exigirSesion() {
    const sesion = await auth();
    if (!sesion) redirect("/login");

    const usuario = await prisma.usuario.findUnique({
        where: { id: Number(sesion.user.id) },
        select: { debeCambiarClave: true },
    });
    if (!usuario) redirect("/login");
    if (usuario.debeCambiarClave) redirect("/perfil/clave");

    return sesion;
}

export async function exigirDocente() {
    const sesion = await auth();
    if (!sesion) redirect("/login");

    const id = Number(sesion.user.id);
    const usuario = await prisma.usuario.findUnique({
        where: { id },
        select: { rol: true, debeCambiarClave: true },
    });
    if (!usuario || !["DOCENTE", "ADMIN"].includes(usuario.rol)) {
        redirect("/perfil");
    }
    if (usuario.debeCambiarClave) redirect("/perfil/clave");

    return { id, rol: usuario.rol };
}