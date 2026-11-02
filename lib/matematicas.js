import katex from "katex";

const FORMULA = /\$\$([\s\S]+?)\$\$/g;

function escapar(texto) {
    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function textoAHtml(texto, { enLinea = false } = {}) {
    const fuente = String(texto ?? "");
    let html = "";
    let ultimo = 0;

    for (const m of fuente.matchAll(FORMULA)) {
        const inicio = m.index;
        const fin = inicio + m[0].length;
        html += escapar(fuente.slice(ultimo, inicio));

        const sola =
            (inicio === 0 || fuente[inicio - 1] === "\n") &&
            (fin === fuente.length || fuente[fin] === "\n");

        html += katex.renderToString(m[1].trim(), {
            displayMode: !enLinea && sola,
            throwOnError: false,
            strict: "ignore",
            maxExpand: 500,
        });
        ultimo = fin;
    }

    html += escapar(fuente.slice(ultimo));
    return html;
}

export function textoPlano(texto, maximo) {
    const plano = String(texto ?? "")
        .replace(FORMULA, "[fórmula]")
        .replace(/\s+/g, " ")
        .trim();
    return maximo && plano.length > maximo
        ? plano.slice(0, maximo) + "..."
        : plano;
}