import {
    Atom,
    Bird,
    Cat,
    Dog,
    Fish,
    Flower2,
    Gamepad2,
    Heart,
    Music,
    Palette,
    Rabbit,
    Rocket,
    Squirrel,
    Turtle,
} from "lucide-react";

export const ICONOS = {
    cohete: Rocket,
    gato: Cat,
    perro: Dog,
    pajaro: Bird,
    pez: Fish,
    tortuga: Turtle,
    conejo: Rabbit,
    ardilla: Squirrel,
    flor: Flower2,
    corazon: Heart,
    juego: Gamepad2,
    musica: Music,
    paleta: Palette,
    atomo: Atom,
};

export const COLORES = {
    azul: "bg-relleno-azul",
    indigo: "bg-relleno-primario",
    morado: "bg-relleno-morado",
    rosa: "bg-relleno-rosa",
    rojo: "bg-relleno-rojo",
    naranja: "bg-relleno-naranja",
    teal: "bg-relleno-teal",
};

export const CLAVES_ICONOS = Object.keys(ICONOS);
export const CLAVES_COLORES = Object.keys(COLORES);