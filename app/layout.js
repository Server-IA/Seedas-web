// Importación de fuentes de Google y estilos globales
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

// Importación del proveedor de Clerk para la autenticación
import { ClerkProvider } from '@clerk/nextjs'

// Importación del componente de encabezado
import Header from '@/app/components/Header'

// Definición de las fuentes a utilizar
const inter = Montserrat({ subsets: ["latin"] });

// Metadatos de la página
export const metadata = {
  title: "seedas.com",
  description: "seedas page",
}

// Componente de diseño principal que envuelve todas las páginas
export default function RootLayout({ children }) {
  return (
    // Proveedor de Clerk para la autenticación
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* Encabezado de la página */}
          <Header />
          
          {/* Contenido principal de la página */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
