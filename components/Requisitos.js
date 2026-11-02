import { Check, Circle } from "lucide-react";

export default function Requisitos({ items, visible = true }) {
    if (!visible) return null;

    return (
        <ul className="mt-2 flex flex-col gap-1">
            {items.map((r) => (
                <li
                    key={r.texto}
                    className={
                        "flex items-center gap-2 text-sm " +
                        (r.cumple ? "text-acierto-oscuro" : "text-gris")
                    }
                >
                    {r.cumple ? (
                        <Check size={16} strokeWidth={3} />
                    ) : (
                        <Circle size={16} strokeWidth={2.5} />
                    )}
                    <span className="sr-only">{r.cumple ? "Cumplido " : "Pendiente "}</span>
                    {r.texto}
                </li>
            ))}
        </ul>
    );
}