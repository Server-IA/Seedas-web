'use client';

import React, { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { VehDestinationContext } from '../context/VehDestinationContext';
import { VehSourceContext } from '../context/VehSourceContext';
import VehMapbox from '../components/Home/VehMapbox';
import VehSearchSection from '../components/Home/VehSearchSection';
import VehContain from "../components/Home/VehContain";
import VehNotification from "../components/Home/VehNotification";
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

            {/* Sección izquierda: búsqueda */}
            <div className="md:col-span-1">
              <VehSearchSection />
            </div>

            {/* Sección derecha: Mapa + Panel */}
            <div className="md:col-span-2 flex flex-col gap-5">
              {/* Mapa */}
              <VehMapbox />

              {/* Panel principal del transportador */}
              <div className="p-6 bg-white border rounded-xl shadow w-full">
              

                {/* Solicitudes */}
                <VehSoliContain />
              </div>
                {/* Notificaciones actualizadas */}
              <div className="p-6 bg-white border rounded-xl shadow w-full">
                  <VehNotification />
            
              </div>

              {/* Publicaciones disponibles */}
              <div className="p-6 bg-white border rounded-xl shadow w-full">
                <VehContain />
              </div>
            </div>
          </div>
        </VehSourceContext.Provider>
      </VehDestinationContext.Provider>
    </VehUserIdContext.Provider>
  );
}
