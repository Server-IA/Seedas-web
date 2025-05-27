'use client';

import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { VehDestinationContext } from '../context/VehDestinationContext';
import { VehSourceContext } from '../context/VehSourceContext';
import VehMapbox from '../components/Home/VehMapbox';
import VehSearchSection from '../components/Home/VehSearchSection';
import VehContain from "../components/Home/VehContain";
import VehSoliContain from "../components/Home/VehSoliContain";
import { VehUserIdContext } from "../context/VehUserIdContext";


export default function TransportPage() {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const { user, isLoaded } = useUser();
  const userId = isLoaded && user ? user.id : null;

  return (
    <VehUserIdContext.Provider value={{ userId }}>
      <VehDestinationContext.Provider value={{ destination, setDestination }}>
        <VehSourceContext.Provider value={{ source, setSource }}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5"> 
            {/* Izquierda: Búsqueda */}
            <div className="md:col-span-1">
              <VehSearchSection />
            </div>

            {/* Derecha: Mapa + Contain pegados */}
            <div className="md:col-span-2 flex flex-col">
              <div className="mb-0">
                <VehMapbox />
              </div>
              <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Panel del Transportador</h1>
      <VehSoliContain />
    </div>
              <div className=" p-6
               bg-white border rounded shadow-md w-full mt-0">
                <VehContain />
              </div>
            </div>
          </div>
        </VehSourceContext.Provider>
      </VehDestinationContext.Provider>
    </VehUserIdContext.Provider>
  );
}
