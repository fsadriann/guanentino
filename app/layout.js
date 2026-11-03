import { Nunito } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Navbar from "../components/Navbar";
import EnlaceSuave from "../components/landing/EnlaceSuave";
import Link from "next/link";
import Image from "next/image";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata = {
  title: "Guanentino Responda",
  description: "Una pregunta al día para prepararte para las pruebas Saber 11",
  appleWebApp: {
    capable: true,
    title: "Guanentino",
    statusBarStyle: "default",
  },
};

export const viewport = {
  themeColor: "#12121c",
};

const scriptTema = `(function(){try{var t=localStorage.getItem("tema");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"oscuro":"claro"}document.documentElement.dataset.tema=t}catch(e){}})()`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${nunito.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="border-t-2 border-borde bg-superficie pb-20 md:pb-6">
          <div className="mx-auto grid max-w-5xl gap-7 px-6 py-8 sm:grid-cols-2 sm:py-10 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Link
                href="/"
                className="mb-3 inline-flex items-center gap-2 text-lg font-extrabold text-primario"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primario-claro">
                  <Image
                    src="/icons/icon-192.png"
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-xl"
                  />
                </span>
                Guanentino Responda
              </Link>
              <p className="max-w-sm text-sm leading-relaxed text-gris">
                Una pregunta al día para prepararte para las pruebas Saber 11,
                aprender de tus errores y seguir tu progreso.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide">
                Explora
              </h2>
              <div className="flex flex-col items-start gap-2 text-sm text-gris">
                <EnlaceSuave destino="como-funciona" className="hover:text-primario">
                  Cómo funciona
                </EnlaceSuave>
                <EnlaceSuave destino="areas" className="hover:text-primario">
                  Áreas del examen
                </EnlaceSuave>
                <Link href="/registro" className="hover:text-primario">
                  Practicar gratis
                </Link>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wide">
                Plataforma
              </h2>
              <div className="flex flex-col items-start gap-2 text-sm text-gris">
                <Link href="/login" className="hover:text-primario">
                  Iniciar sesión
                </Link>
                <Link href="/privacidad" className="hover:text-primario">
                  Política de privacidad
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-borde px-6 pt-5 text-center text-xs text-gris">
            © {new Date().getFullYear()} Guanentino Responda. Hecho para aprender
            con constancia.
          </div>
        </footer>
      </body>
    </html>
  );
}