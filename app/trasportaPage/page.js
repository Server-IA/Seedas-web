'use client';
import React, { useState } from 'react';
import SearchSectionTrans from '../components/Home/SearchSectionTrans';
import VehicleForm from '../components/Home/VehicleForm';
import { SourceContext } from '../context/SourceContext';
import { DestinationContext } from '../context/DestinationContext';
import MapboxMapTrans from '../components/Home/MapboxTranspor';

export default function TransportaPage() {
const [source, setSource] = useState([]) ;
const [destination, setDestination] = useState([]) ;
  return (
    <SourceContext.Provider value={{ source, setSource }}>
          <DestinationContext.Provider value={{ destination, setDestination }}>
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
         
            <SearchSectionTrans type="source" placeholder="Ubicación de recogida" />
            <VehicleForm />
          </div>
          <div className="col-span-2">
            <MapboxMapTrans />
          </div>
        </div>
        </DestinationContext.Provider>
        </SourceContext.Provider>
  );
}

