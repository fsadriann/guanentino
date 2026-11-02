import { textoAHtml } from "../lib/matematicas";

export default function Texto({ children, enLinea = false, className = "" }) {
    return (
        <span
            className={"whitespace-pre-line " + className}
            dangerouslySetInnerHTML={{ __html: textoAHtml(children, { enLinea }) }}
        />
    );
}