function clave(nombre) {
    return nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

const estilos = {
    "lectura critica": {
        emoji: "📖",
        fondo: "bg-relleno-rosa",
        circulo: "bg-relleno-rosa border-black/25",
    },
    matematicas: {
        emoji: "🔢",
        fondo: "bg-relleno-azul",
        circulo: "bg-relleno-azul border-black/25",
    },
    "sociales y ciudadanas": {
        emoji: "🌎",
        fondo: "bg-relleno-naranja",
        circulo: "bg-relleno-naranja border-black/25",
    },
    "ciencias naturales": {
        emoji: "🔬",
        fondo: "bg-relleno-teal",
        circulo: "bg-relleno-teal border-black/25",
    },
    ingles: {
        emoji: "🗣️",
        fondo: "bg-relleno-morado",
        circulo: "bg-relleno-morado border-black/25",
    },
};

const porDefecto = {
    emoji: "📚",
    fondo: "bg-relleno-primario",
    circulo: "bg-relleno-primario border-black/25",
};

export function estiloArea(nombre) {
    return estilos[clave(nombre)] ?? porDefecto;
}