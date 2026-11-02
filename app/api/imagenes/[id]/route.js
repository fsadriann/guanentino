import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";

export async function GET(request, { params }) {
    const sesion = await auth();
    if (!sesion) return new Response("No autorizado", { status: 401 });

    const { id } = await params;
    const imagenId = Number(id);
    if (!Number.isInteger(imagenId)) {
        return new Response("No encontrada", { status: 404 });
    }

    const imagen = await prisma.imagen.findUnique({
        where: { id: imagenId },
        select: { datos: true, tipo: true },
    });
    if (!imagen) return new Response("No encontrada", { status: 404 });

    return new Response(imagen.datos, {
        headers: {
            "Content-Type": imagen.tipo,
            "Cache-Control": "private, max-age=31536000, immutable",
            "X-Content-Type-Options": "nosniff",
        },
    });
}