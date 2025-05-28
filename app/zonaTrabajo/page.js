'use client';
import React, { useState } from 'react';
import ZonaList from '../components/Home/ZonaList';
import ZonaCalendario from '../components/Home/ZonaCalendario';


const zonaTrabajo = () => {
  const [filtros, setFiltros] = useState({ zona: '', role: 'all' });
  const [rutaSeleccionada, setRutaSeleccionada] = useState({ source: null, destination: null });

  return (
    <div className="min-h-screen p-6 bg-[#F1F5F9]">
      <h1 className="text-3xl font-bold text-center mb-8">Zona de Trabajo</h1>

      <ZonaCalendario filtros={filtros} />
      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <ZonaList filtros={filtros} onSeleccionarRuta={setRutaSeleccionada} />
 
      </div>
    </div>
  );
};

export default zonaTrabajo;
