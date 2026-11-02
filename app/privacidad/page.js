export const metadata = { title: "Política de privacidad" };

const COLEGIO = "Colegio San José de Guanentá";
const CORREO = "contactenos@colegioguanenta.edu.co";
const FECHA = "1 de noviembre de 2026";

function Seccion({ titulo, children }) {
    return (
        <section className="mt-8">
            <h2 className="mb-2 text-xl font-extrabold">{titulo}</h2>
            <div className="flex flex-col gap-2 leading-relaxed">{children}</div>
        </section>
    );
}

export default function Privacidad() {
    return (
        <main className="mx-auto max-w-2xl p-6">
            <h1 className="mb-2 text-2xl font-extrabold">Política de privacidad</h1>
            <p className="text-gris">
                Esta política explica qué datos guarda Guanentino Responda, para qué los
                usa y cuáles son tus derechos. Está escrita en palabras sencillas para
                que puedas leerla tú y tu familia.
            </p>

            <Seccion titulo="Quién responde por los datos">
                <p>
                    Guanentino Responda es una plataforma de práctica para las pruebas
                    Saber 11 del {COLEGIO}. El responsable del tratamiento de los datos es{" "}
                    {COLEGIO}. Para cualquier consulta escribe a{" "}
                    <a href={"mailto:" + CORREO} className="font-extrabold text-azul underline">
                        {CORREO}
                    </a>
                    .
                </p>
            </Seccion>

            <Seccion titulo="Qué datos guardamos">
                <ul className="list-disc pl-6">
                    <li>Nombre, apellido y correo electrónico</li>
                    <li>Nombre de usuario y colegio, si lo escribes</li>
                    <li>La clave, guardada cifrada. Nadie puede leerla, ni siquiera los docentes</li>
                    <li>Tus respuestas, tus puntos y tu racha de días</li>
                    <li>Tus respuestas en la práctica libre</li>
                    <li>El ícono y el color que elijas para tu avatar</li>
                    <li>Si decides aparecer o no en el ranking</li>
                    <li>Los reportes que envíes sobre las preguntas, con tu comentario</li>
                    <li>
                        La dirección de internet desde la que se hacen intentos fallidos de
                        inicio de sesión. Se guarda por poco tiempo, normalmente un día o
                        menos, para evitar abusos
                    </li>
                </ul>
                <p>No pedimos fotos, teléfono, documentos de identidad ni ubicación.</p>
            </Seccion>

            <Seccion titulo="Para qué los usamos">
                <p>
                    Usamos los datos solo para que puedas entrar a tu cuenta, practicar,
                    ver tu avance y aparecer en el ranking. No los vendemos, no los
                    compartimos con terceros con fines comerciales y no mostramos
                    publicidad.
                </p>
            </Seccion>

            <Seccion titulo="Quién puede verlos">
                <p>
                    Los docentes autorizados pueden ver tu nombre, tu usuario, tu colegio,
                    tus puntos y cuántas preguntas has respondido.
                </p>
                <p>
                    Los demás estudiantes solo ven tu nombre de usuario, tu avatar, tus
                    puntos y cuántas preguntas has respondido, y únicamente en el ranking.
                    Nunca ven tu nombre real ni tu correo. Si prefieres, puedes dejar de
                    aparecer en el ranking desde tu configuración.
                </p>
                <p>
                    Los comentarios de los reportes los ven solo los docentes y salen sin
                    tu nombre.
                </p>
                <p>
                    Las personas que mantienen la plataforma pueden acceder a los datos
                    únicamente para hacer su trabajo técnico.
                </p>
            </Seccion>

            <Seccion titulo="Cookies y datos en tu navegador">
                <p>
                    Usamos una cookie necesaria para mantener tu sesión iniciada y un dato
                    guardado en tu navegador para recordar si prefieres el modo claro o el
                    oscuro. No usamos cookies de publicidad ni de seguimiento.
                </p>
            </Seccion>

            <Seccion titulo="Dónde se guardan">
                <p>
                    La aplicación se aloja en Vercel y la base de datos está en Neon, en
                    servidores de Brasil. Son servicios externos que usamos como
                    infraestructura y están fuera de Colombia.
                </p>
            </Seccion>

            <Seccion titulo="Cuánto tiempo los guardamos">
                <p>
                    Guardamos tus datos mientras tengas tu cuenta. Si eliminas tu cuenta,
                    se borran tu perfil, tus respuestas, tus puntos, tu racha y tus
                    reportes. Una copia puede permanecer por un tiempo limitado en las
                    copias de seguridad del servicio de base de datos.
                </p>
            </Seccion>

            <Seccion titulo="Menores de edad">
                <p>
                    Esta plataforma está dirigida a estudiantes que pueden ser menores de
                    edad. Por eso el tratamiento de sus datos se hace con la autorización
                    de sus padres o representantes legales, que gestiona el colegio.
                </p>
            </Seccion>

            <Seccion titulo="Tus derechos">
                <p>
                    Tú, o tus padres o representantes si eres menor, pueden pedir en
                    cualquier momento conocer los datos que guardamos, corregirlos o pedir
                    que se eliminen. Desde la página de configuración de tu cuenta puedes
                    editar tus datos, descargar una copia de ellos y eliminar tu cuenta.
                    Si no puedes hacerlo tú mismo, escribe a {CORREO} y responderemos lo
                    antes posible.
                </p>
                <p>
                    Esta política se basa en la Ley 1581 de 2012 y sus normas
                    reglamentarias. También puedes presentar una queja ante la
                    Superintendencia de Industria y Comercio.
                </p>
            </Seccion>

            <Seccion titulo="Cambios en esta política">
                <p>
                    Si cambiamos esta política, actualizaremos la fecha que aparece abajo.
                </p>
            </Seccion>

            <p className="mt-8 text-sm text-gris">Última actualización {FECHA}</p>
        </main>
    );
}