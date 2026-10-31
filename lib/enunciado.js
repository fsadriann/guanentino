export function separarEnunciado(enunciado) {
    const partes = enunciado
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);

    if (partes.length <= 1) {
        return { instruccion: null, texto: null, pregunta: enunciado.trim() };
    }

    let instruccion = null;
    if (
        /^(lee el texto|read the text|complete the sentence)/i.test(partes[0]) &&
        partes[0].length < 80
    ) {
        instruccion = partes.shift();
    }

    const pregunta = partes.pop();
    const texto = partes.length > 0 ? partes.join("\n\n") : null;

    return { instruccion, texto, pregunta };
}