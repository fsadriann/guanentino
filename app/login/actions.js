"use server";

import { AuthError } from "next-auth";
import { signIn } from "../../auth";

export async function iniciarSesion(estadoPrevio, formData) {
    try {
        await signIn("credentials", {
            usuario: formData.get("usuario"),
            clave: formData.get("clave"),
            redirectTo: "/perfil",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "Usuario o clave incorrectos" };
        }
        throw error;
    }
}