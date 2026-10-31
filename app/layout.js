import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Link from "next/link";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata = {
  title: "Guanentino Responda",
  description: "Una pregunta al día para prepararte para las pruebas Saber 11",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <footer className="border-t-2 border-borde p-4 text-center text-sm text-gris">
          <Link href="/privacidad" className="font-bold underline">
            Política de privacidad
          </Link>
        </footer>
      </body>
    </html>
  );
}