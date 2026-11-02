export const REGLAS = {
    usuario: { min: 3, max: 20 },
    nombre: { min: 2, max: 50 },
    colegio: { max: 100 },
    correo: { max: 100 },
    clave: { min: 8, max: 64 },
};

const SOLO_USUARIO = /^[a-z0-9_.]+$/;
const SOLO_NOMBRE = /^[\p{L}][\p{L}\s'’-]*$/u;

export function normalizarUsuario(valor) {
    return String(valor ?? "").trim().toLowerCase();
}

export function normalizarCorreo(valor) {
    return String(valor ?? "").trim().toLowerCase();
}

export function validarUsuario(valor) {
    const v = valor ?? "";
    if (v.length === 0) return "Escribe un usuario";
    if (/\s/.test(v)) return "El usuario no puede tener espacios";
    if (!SOLO_USUARIO.test(v)) {
        return "Solo se permiten letras minúsculas sin tildes, números, punto y guion bajo";
    }
    if (v.length < REGLAS.usuario.min) {
        return "El usuario debe tener mínimo " + REGLAS.usuario.min + " caracteres";
    }
    if (v.length > REGLAS.usuario.max) {
        return "El usuario puede tener máximo " + REGLAS.usuario.max + " caracteres";
    }
    return null;
}

export function requisitosUsuario(valor) {
    const v = valor ?? "";
    return [
        {
            texto: "De 3 a 20 caracteres",
            cumple: v.length >= REGLAS.usuario.min && v.length <= REGLAS.usuario.max,
        },
        {
            texto: "Solo minúsculas sin tildes, números, punto y guion bajo",
            cumple: v.length > 0 && SOLO_USUARIO.test(v),
        },
    ];
}

export function validarNombre(valor, etiqueta = "nombre") {
    const v = (valor ?? "").trim();
    if (!v) return "Escribe tu " + etiqueta;
    if (v.length < REGLAS.nombre.min) return "El " + etiqueta + " es muy corto";
    if (v.length > REGLAS.nombre.max) return "El " + etiqueta + " es muy largo";
    if (!SOLO_NOMBRE.test(v)) {
        return "El " + etiqueta + " solo puede tener letras, espacios, guion y apóstrofo";
    }
    return null;
}

export function validarColegio(valor) {
    const v = (valor ?? "").trim();
    if (v.length > REGLAS.colegio.max) return "El nombre del colegio es muy largo";
    return null;
}

export function validarCorreo(valor) {
    const v = (valor ?? "").trim();
    if (!v) return "Escribe tu correo";
    if (/\s/.test(v)) return "El correo no puede tener espacios";
    if (v.length > REGLAS.correo.max) return "El correo es muy largo";

    const arrobas = v.split("@").length - 1;
    if (arrobas === 0) return "Falta el @";
    if (arrobas > 1) return "El correo solo puede tener un @";

    const [local, dominio] = v.split("@");
    if (!local) return "Falta lo que va antes del @";
    if (!dominio) return "Falta el dominio después del @, por ejemplo gmail.com";
    if (!dominio.includes(".")) {
        return "El dominio debe tener un punto, por ejemplo gmail.com";
    }
    if (dominio.startsWith(".") || dominio.endsWith(".") || dominio.includes("..")) {
        return "El dominio no es válido";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "El correo no es válido";
    return null;
}

export function requisitosClave(valor) {
    const v = valor ?? "";
    return [
        {
            texto: "De 8 a 64 caracteres",
            cumple: v.length >= REGLAS.clave.min && v.length <= REGLAS.clave.max,
        },
        { texto: "Al menos una letra", cumple: /\p{L}/u.test(v) },
        { texto: "Al menos un número", cumple: /\d/.test(v) },
        { texto: "Sin espacios", cumple: v.length > 0 && !/\s/.test(v) },
    ];
}

export function validarClave(valor, usuario = "") {
    const v = valor ?? "";
    if (!v) return "Escribe una clave";
    if (v.length < REGLAS.clave.min) {
        return "La clave debe tener mínimo " + REGLAS.clave.min + " caracteres";
    }
    if (v.length > REGLAS.clave.max || new TextEncoder().encode(v).length > 72) {
        return "La clave es muy larga";
    }
    if (/\s/.test(v)) return "La clave no puede tener espacios";
    if (!/\p{L}/u.test(v)) return "La clave debe tener al menos una letra";
    if (!/\d/.test(v)) return "La clave debe tener al menos un número";
    if (usuario && v.toLowerCase() === String(usuario).trim().toLowerCase()) {
        return "La clave no puede ser igual a tu usuario";
    }
    return null;
}

export function validarRegistro(datos) {
    const limpio = {
        usuario: normalizarUsuario(datos.usuario),
        nombre: String(datos.nombre ?? "").trim().replace(/\s+/g, " "),
        apellido: String(datos.apellido ?? "").trim().replace(/\s+/g, " "),
        correo: normalizarCorreo(datos.correo),
        colegio: String(datos.colegio ?? "").trim(),
        clave: String(datos.clave ?? ""),
    };

    const candidatos = {
        usuario: validarUsuario(limpio.usuario),
        nombre: validarNombre(limpio.nombre, "nombre"),
        apellido: validarNombre(limpio.apellido, "apellido"),
        correo: validarCorreo(limpio.correo),
        clave: validarClave(limpio.clave, limpio.usuario),
        colegio: validarColegio(limpio.colegio),
    };

    const errores = {};
    for (const [campo, mensaje] of Object.entries(candidatos)) {
        if (mensaje) errores[campo] = mensaje;
    }
    return { errores, limpio };
}