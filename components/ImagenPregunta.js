export default function ImagenPregunta({ id, alt }) {
    if (!id) return null;

    return (
        <figure
            className="tarjeta mb-4 flex justify-center p-2"
            style={{ background: "#ffffff" }}
        >
            <img
                src={"/api/imagenes/" + id}
                alt={alt || "Imagen de la pregunta"}
                loading="lazy"
                className="h-auto max-h-80 w-auto max-w-full"
            />
        </figure>
    );
}