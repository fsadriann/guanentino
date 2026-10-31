import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, Download, KeyRound } from "lucide-react";
import { exigirSesion } from "../../../lib/permisos";
import { prisma } from "../../../lib/prisma";
import BotonTema from "../../../components/BotonTema";
import FormularioPerfil from "./formulario-perfil";
import FormularioCorreo from "./formulario-correo";
import InterruptorRanking from "./interruptor-ranking";
import EnlaceVolver from "../../../components/EnlaceVolver";
import FormularioEliminar from "./formulario-eliminar";

export default async function Configuracion() {
    const sesion = await exigirSesion();

    const usuario = await prisma.usuario.findUnique({
        where: { id: Number(sesion.user.id) },
        select: {
            rol: true,
            nombre: true,
            apellido: true,
            colegio: true,
            correo: true,
            avatarIcono: true,
            avatarColor: true,
            ocultoEnRanking: true,
        },
    });
    if (!usuario) redirect("/login");

    return (
        <main className="mx-auto max-w-xl p-6">
            <EnlaceVolver href="/perfil">Perfil</EnlaceVolver>
            <h1 className="mb-6 text-2xl font-extrabold">Configuración</h1>

            <section className="mb-8">
                <h2 className="mb-3 text-xl font-extrabold">Tu perfil</h2>
                <FormularioPerfil
                    usuario={{
                        nombre: usuario.nombre,
                        apellido: usuario.apellido,
                        colegio: usuario.colegio,
                        avatarIcono: usuario.avatarIcono,
                        avatarColor: usuario.avatarColor,
                    }}
                />
            </section>

            <section className="mb-8">
                <h2 className="mb-3 text-xl font-extrabold">Correo</h2>
                <FormularioCorreo correo={usuario.correo} />
            </section>

            <section className="mb-8">
                <h2 className="mb-3 text-xl font-extrabold">Apariencia</h2>
                <div className="tarjeta flex items-center justify-between gap-4">
                    <div>
                        <p className="font-extrabold">Modo oscuro</p>
                        <p className="text-sm text-gris">Cambia los colores de la página</p>
                    </div>
                    <BotonTema />
                </div>
            </section>

            <section className="mb-8">
                <h2 className="mb-3 text-xl font-extrabold">Privacidad</h2>
                <div className="tarjeta">
                    <InterruptorRanking visibleInicial={!usuario.ocultoEnRanking} />
                </div>
            </section>

            <section className="mb-8">
                <h2 className="mb-3 text-xl font-extrabold">Seguridad</h2>
                <Link
                    href="/perfil/clave"
                    className="tarjeta flex items-center gap-3 hover:bg-superficie"
                >
                    <KeyRound size={22} strokeWidth={2.5} className="text-azul" />
                    <span className="font-extrabold">Cambiar clave</span>
                </Link>
            </section>      <section className="mb-8">
                <h2 className="mb-3 text-xl font-extrabold">Tus datos</h2>
                <div className="flex flex-col gap-3">
                    <a
                        href="/api/mis-datos"
                        download="mis-datos-guanentino.json"
                        className="tarjeta flex items-center gap-3 hover:bg-superficie"
                    >
                        <Download size={22} strokeWidth={2.5} className="text-azul" />
                        <span>
                            <span className="block font-extrabold">Descargar mis datos</span>
                            <span className="text-sm text-gris">
                                Un archivo con tu perfil y tus respuestas
                            </span>
                        </span>
                    </a>
                    <FormularioEliminar puedeEliminar={usuario.rol === "ESTUDIANTE"} />
                </div>
            </section>
        </main>
    );
}