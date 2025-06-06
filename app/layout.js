// Importación de fuentes de Google y estilos globales
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import { ClerkProvider } from '@clerk/nextjs';
import { esES } from '@clerk/localizations';
import Header from '../app/components/Header';
import Footer from '../app/components/Footer';

// Asignación correcta de las fuentes
const interFont = Inter({ subsets: ["latin"] });
const montserratFont = Montserrat({ subsets: ["latin"] });

// Metadatos de la página
export const metadata = {
  title: "seedas.com",
  description: "seedas page",
}

// Componente de diseño principal que envuelve todas las páginas
export default function RootLayout({ children }) {
  return (
    // Proveedor de Clerk para la autenticación
      <ClerkProvider localization={esES}>
      <html lang="en">
        <body className={interFont.className}>
          <Header />
          {children}
          <link href='https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css' rel='stylesheet' />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
