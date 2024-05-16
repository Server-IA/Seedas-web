import {  SignedIn  } from '@clerk/nextjs'
// Componente IndexPage
export default function IndexPage() {
  return (
    <>
      {/* Componente SignedIn para mostrar contenido solo a usuarios autenticados */}
     
        {/* Contenido solo visible para usuarios autenticados */}

        <div>Bienvenido a la página de inicio</div>
        
        <SignedIn>
          <usuario />
          </SignedIn>
      {/* Contenido adicional de la página */}
      
    </>
  );
}
