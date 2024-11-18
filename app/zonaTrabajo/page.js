'use client';
import React, { useState } from 'react';
import ZoneDetails from '../components/Home/ZoneDetails';
import ZoneList from '../components/Home/ZoneList';
import { SourceContext } from '../context/SourceContext';
import { DestinationContext } from '../context/DestinationContext';
import ZoneMap from '../components/Home/ZoneMap';
import ZoneSearch from '../components/Home/ZoneSearch';
import ZoneContain from '../components/Home/ZoneContain';

export default function TransportaPage() {
const [source, setSource] = useState([]) ;
const [destination, setDestination] = useState([]) ;
  return (
    <SourceContext.Provider value={{ source, setSource }}>
          <DestinationContext.Provider value={{ destination, setDestination }}>
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
         
            <ZoneSearch type="source" placeholder="Ubicación de recogida" />
            <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nuestras Publicaciones como Transportador</h1>
            <ZoneList />
            </div>
          
            <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nuestras Publicaciones como Productor</h1>
      <ZoneContain />
          
            </div>
          </div>
          <div className="col-span-2">
            <ZoneMap />
          </div>
        </div>
        </DestinationContext.Provider>
        </SourceContext.Provider>
  );
}

