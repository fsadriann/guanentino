export default function BarraProgreso({ hechas, total, etiqueta = "Progreso" }) {
    if (!total || total <= 0) return null;

    const hechasFinal = Math.min(hechas, total);
    const porcentaje = Math.round((hechasFinal / total) * 100);

    return (
        <div className="mb-6">
            <div className="mb-1 flex justify-between text-sm font-extrabold text-gris">
                <span>{etiqueta}</span>
                <span>
                    {hechasFinal} de {total}
                </span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-borde">
                <div
                    className="h-full rounded-full bg-primario"
                    style={{ width: porcentaje + "%" }}
                />
            </div>
        </div>
    );
}
