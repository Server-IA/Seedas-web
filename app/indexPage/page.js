// Importa los componentes necesarios de Clerk
import { RedirectToHome, SignedIn } from "@clerk/nextjs";

// Componente IndexPage
export default function IndexPage() {
  return (
    <>
      {/* Componente SignedIn para mostrar contenido solo a usuarios autenticados */}
      <SignedIn>
        {/* Contenido solo visible para usuarios autenticados */}
        <div>Bienvenido a la página de inicio</div>
      </SignedIn>
      {/* Contenido adicional de la página */}
      <div>inicie sesión para ver el contenido de la pagina ...</div>
    </>
  );
}
