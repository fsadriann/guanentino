export default function BarraProgreso({
    hechas,
    total,
    etiqueta = "Progreso",
    desde = null,
}) {
    if (!total || total <= 0) return null;

    const hechasFinal = Math.min(Math.max(hechas, 0), total);
    const porcentaje = Math.round((hechasFinal / total) * 100);
    const desdeFinal =
        desde === null ? hechasFinal : Math.min(Math.max(desde, 0), hechasFinal);
    const desdePorcentaje = Math.round((desdeFinal / total) * 100);
    const anima = desdePorcentaje < porcentaje;

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
                    className={
                        "h-full rounded-full bg-primario" +
                        (anima ? " barra-progreso" : "")
                    }
                    style={{
                        width: porcentaje + "%",
                        "--desde": desdePorcentaje + "%",
                        "--hasta": porcentaje + "%",
                    }}
                />
            </div>
        </div>
    );
}
