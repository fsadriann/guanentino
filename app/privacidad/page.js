export const metadata = { title: "Política de privacidad" };

export default function Privacidad() {
    return (
        <main className="mx-auto max-w-2xl p-6">
            <h1 className="mb-4 text-2xl font-bold">Política de privacidad</h1>

            <h2 className="mt-6 mb-2 text-xl font-bold">Quién responde por los datos</h2>
            <p>
                Guanentino Responda es una plataforma de práctica para las pruebas
                Saber 11 de [NOMBRE DEL COLEGIO]. El responsable del tratamiento de los
                datos es [NOMBRE DEL COLEGIO]. Para cualquier consulta escribe a
                [CORREO DE CONTACTO].
            </p>

            <h2 className="mt-6 mb-2 text-xl font-bold">Qué datos guardamos</h2>
            <ul className="list-disc pl-6">
                <li>Nombre, apellido y correo electrónico</li>
                <li>Nombre de usuario y colegio</li>
                <li>La clave, guardada cifrada. Nadie puede leerla, ni siquiera los docentes</li>
                <li>Tus respuestas, tus puntos y tu racha de días</li>
                <li>Los reportes que envíes sobre las preguntas, con tu comentario</li>
            </ul>

            <h2 className="mt-6 mb-2 text-xl font-bold">Para qué los usamos</h2>
            <p>
                Usamos los datos solo para que puedas entrar a tu cuenta, practicar,
                ver tu avance y aparecer en el ranking. No los vendemos, no los
                compartimos con terceros con fines comerciales y no mostramos
                publicidad.
            </p>

            <h2 className="mt-6 mb-2 text-xl font-bold">Quién puede verlos</h2>
            <p>
                Los docentes autorizados pueden ver tu nombre, tu usuario, tus puntos
                y cuántas preguntas has respondido. Los demás estudiantes solo ven tu
                nombre de usuario y tus puntos en el ranking. Nunca ven tu nombre real
                ni tu correo. Si prefieres, puedes dejar de
                aparecer en el ranking desde tu configuración.
            </p>

            <h2 className="mt-6 mb-2 text-xl font-bold">Dónde se guardan</h2>
            <p>
                Los datos se guardan en servicios de alojamiento externos que usamos
                como infraestructura. La aplicación corre en Vercel y la base de datos
                está en Neon, en servidores de Brasil.
            </p>

            <h2 className="mt-6 mb-2 text-xl font-bold">Menores de edad</h2>
            <p>
                Esta plataforma está dirigida a estudiantes que pueden ser menores de
                edad. Por eso el tratamiento de sus datos se hace con la autorización
                de sus padres o representantes legales, que gestiona el colegio.
            </p>

            <h2 className="mt-6 mb-2 text-xl font-bold">Tus derechos</h2>
            <p>
                Tú, o tus padres o representantes si eres menor, pueden pedir en
                cualquier momento conocer los datos que guardamos, corregirlos o pedir
                que se eliminen. Desde la página de configuración de tu cuenta puedes
                editar tus datos, descargar una copia de ellos y eliminar tu cuenta.
                Al eliminarla se borran tu perfil, tus respuestas, tus puntos y tu
                racha. Si no puedes hacerlo tú mismo, escribe a [CORREO DE CONTACTO] y
                responderemos lo antes posible.
            </p>

            <p className="mt-6 text-sm opacity-70">
                Última actualización [FECHA]
            </p>
        </main>
    );
}