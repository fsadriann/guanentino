import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function EnlaceVolver({ href, children }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-1 text-sm font-extrabold text-azul"
        >
            <ChevronLeft size={18} strokeWidth={3} /> {children}
        </Link>
    );
}