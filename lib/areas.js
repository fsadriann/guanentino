function clave(nombre) {
    return nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

const estilos = {
    "lectura critica": {
        emoji: "📖",
        fondo: "bg-morado",
        circulo: "bg-morado border-morado-oscuro",
    },
    matematicas: {
        emoji: "🔢",
        fondo: "bg-azul",
        circulo: "bg-azul border-azul-oscuro",
    },
    "sociales y ciudadanas": {
        emoji: "🌎",
        fondo: "bg-naranja",
        circulo: "bg-naranja border-naranja-oscuro",
    },
    "ciencias naturales": {
        emoji: "🔬",
        fondo: "bg-primario",
        circulo: "bg-primario border-primario-oscuro",
    },
    ingles: {
        emoji: "🗣️",
        fondo: "bg-rosa",
        circulo: "bg-rosa border-rosa-oscuro",
    },
};

const porDefecto = {
    emoji: "📚",
    fondo: "bg-azul",
    circulo: "bg-azul border-azul-oscuro",
};

export function estiloArea(nombre) {
    return estilos[clave(nombre)] ?? porDefecto;
}