import SearchSection from "../components/Home/SearchSection";
import GoogleMaps from "../components/Home/GoogleMaps";

// Componente IndexPage
export default function IndexPage() {
  return (
    <>
      {/* Componente SignedIn para mostrar contenido solo a usuarios autenticados */}
     
        {/* Contenido solo visible para usuarios autenticados */}

        
      {/* Contenido adicional de la página */}
      <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-5'>
      <div>
        <SearchSection/>
      </div>
      <div className='col-span-2'>
        <GoogleMaps/>
      </div>
    
    </div>
    </>
  );
}
