import sharp from "sharp";
import { prisma } from "./prisma";

export const MAX_BYTES = 900 * 1024;

export async function procesarImagen(archivo) {
    if (!archivo || typeof archivo === "string" || archivo.size === 0) {
        return { vacio: true };
    }
    if (archivo.size > MAX_BYTES) {
        return { error: "La imagen es muy grande, el máximo es 900 KB" };
    }

    try {
        const original = Buffer.from(await archivo.arrayBuffer());
        const opciones = { limitInputPixels: 40_000_000 };

        const meta = await sharp(original, opciones).metadata();
        if (!["png", "jpeg", "webp", "gif"].includes(meta.format)) {
            return { error: "Usa una imagen PNG, JPG, WebP o GIF" };
        }

        const { data, info } = await sharp(original, opciones)
            .rotate()
            .resize({ width: 1200, withoutEnlargement: true })
            .flatten({ background: "#ffffff" })
            .webp({ quality: 85 })
            .toBuffer({ resolveWithObject: true });

        return { datos: data, ancho: info.width, alto: info.height };
    } catch {
        return { error: "No se pudo leer la imagen. Prueba con otra" };
    }
}

export async function crearImagen({ datos, ancho, alto }) {
    const imagen = await prisma.imagen.create({
        data: { datos, tipo: "image/webp", ancho, alto },
        select: { id: true },
    });
    return imagen.id;
}