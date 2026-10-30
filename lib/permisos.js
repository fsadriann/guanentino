import { redirect } from "next/navigation";
import { auth } from "../auth";
import { prisma } from "./prisma";

export async function exigirDocente() {
    const sesion = await auth();
    if (!sesion) redirect("/login");

    const id = Number(sesion.user.id);
    const usuario = await prisma.usuario.findUnique({
        where: { id },
        select: { rol: true },
    });
    if (!usuario || !["DOCENTE", "ADMIN"].includes(usuario.rol)) {
        redirect("/perfil");
    }
    return { id, rol: usuario.rol };
}