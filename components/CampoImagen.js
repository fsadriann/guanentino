"use client";

import { useEffect, useRef, useState } from "react";

const LIMITE = 800 * 1024;

async function comprimir(archivo) {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, 1200 / bitmap.width);
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(bitmap.width * escala);
  lienzo.height = Math.round(bitmap.height * escala);

  const ctx = lienzo.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, lienzo.width, lienzo.height);
  ctx.drawImage(bitmap, 0, 0, lienzo.width, lienzo.height);
  bitmap.close?.();

  for (const calidad of [0.85, 0.7, 0.55]) {
    for (const tipo of ["image/webp", "image/jpeg"]) {
      const blob = await new Promise((res) =>
        lienzo.toBlob(res, tipo, calidad)
      );
      if (blob && blob.type === tipo && blob.size <= LIMITE) return blob;
    }
  }
  return null;
}

export default function CampoImagen({ actualId = null, actualAlt = "" }) {
  const contenedor = useRef(null);
  const [vista, setVista] = useState(null);
  const [error, setError] = useState(null);
  const [quitar, setQuitar] = useState(false);
  const [alt, setAlt] = useState(actualAlt ?? "");
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    const formulario = contenedor.current?.closest("form");
    if (!formulario) return;
    function alRestablecer() {
      setVista(null);
      setError(null);
      setQuitar(false);
      setAlt(actualAlt ?? "");
    }
    formulario.addEventListener("reset", alRestablecer);
    return () => formulario.removeEventListener("reset", alRestablecer);
  }, [actualAlt]);

  useEffect(() => {
    return () => {
      if (vista) URL.revokeObjectURL(vista);
    };
  }, [vista]);

  async function alElegir(e) {
    const campo = e.target;
    const archivo = campo.files?.[0];
    setError(null);
    setVista(null);
    if (!archivo) return;

    if (!archivo.type.startsWith("image/") || archivo.type === "image/svg+xml") {
      campo.value = "";
      setError("Usa una imagen PNG, JPG, WebP o GIF");
      return;
    }

    setOcupado(true);
    try {
      const blob = await comprimir(archivo);
      if (!blob) {
        campo.value = "";
        setError("No se pudo reducir la imagen lo suficiente. Prueba con una más pequeña");
        return;
      }
      const extension = blob.type === "image/webp" ? "webp" : "jpg";
      const reducida = new File([blob], "imagen." + extension, {
        type: blob.type,
      });
      const lista = new DataTransfer();
      lista.items.add(reducida);
      campo.files = lista.files;
      setVista(URL.createObjectURL(reducida));
    } catch {
      campo.value = "";
      setError("No se pudo leer la imagen. Prueba con otra");
    } finally {
      setOcupado(false);
    }
  }

  const hayActual = Boolean(actualId) && !quitar && !vista;
  const hayImagen = Boolean(vista) || hayActual;

  return (
    <div ref={contenedor} className="flex flex-col gap-2">
      <p className="text-sm font-extrabold">
        Imagen <span className="font-semibold text-gris">(opcional)</span>
      </p>

      {hayActual && (
        <img
          src={"/api/imagenes/" + actualId}
          alt="Imagen actual de la pregunta"
          className="max-h-40 w-auto self-start rounded-xl border-2 border-borde"
          style={{ background: "#ffffff" }}
        />
      )}
      {vista && (
        <img
          src={vista}
          alt="Vista previa de la imagen nueva"
          className="max-h-40 w-auto self-start rounded-xl border-2 border-borde"
          style={{ background: "#ffffff" }}
        />
      )}

      <input
        type="file"
        name="imagen"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={alElegir}
        className="campo"
      />
      {ocupado && <p className="text-sm text-gris">Preparando la imagen...</p>}
      {error && <p className="mensaje-error">{error}</p>}

      {actualId && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="quitarImagen"
            checked={quitar}
            onChange={(e) => setQuitar(e.target.checked)}
            className="h-5 w-5 accent-primario"
          />
          Quitar la imagen actual
        </label>
      )}

      {hayImagen && (
        <div>
          <input
            name="imagenAlt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            maxLength={300}
            placeholder="Describe la imagen en una frase"
            className="campo"
          />
          <p className="mt-1 text-sm text-gris">
            Sirve para quienes no pueden verla. Por ejemplo, triángulo
            rectángulo con catetos de 3 y 4.
          </p>
        </div>
      )}
    </div>
  );
}