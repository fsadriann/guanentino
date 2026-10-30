import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { usuario: {}, clave: {} },
      authorize: async (credenciales) => {
        const encontrado = await prisma.usuario.findUnique({
          where: { usuario: String(credenciales.usuario) },
        });
        if (!encontrado) return null;

        const coincide = await bcrypt.compare(
          String(credenciales.clave),
          encontrado.clave
        );
        if (!coincide) return null;

        return { id: String(encontrado.id), name: encontrado.nombre, rol: encontrado.rol };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = user.rol;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.rol = token.rol;
      return session;
    },
  },
});