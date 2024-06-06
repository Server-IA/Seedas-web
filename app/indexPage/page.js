
"use client"; // Esta línea parece estar fuera de lugar, puede que necesites revisar su ubicación

import React, { useState } from 'react'
import SearchSection from '../components/Home/SearchSection'
import GoogleMaps from '../components/Home/GoogleMaps'
import { SourceContext } from '../context/SourceContext'
import { DestinationContext } from '../context/DestinationContext'
import { LoadScript } from '@react-google-maps/api';

export default function indexPage() {
  const [source, setSource] = useState([])
  const [destination, setDestination] = useState([])
  
  return (
    <SourceContext.Provider value={{ source, setSource }}>
      <DestinationContext.Provider value={{ destination, setDestination }}>
        <LoadScript
        libraries={['places']}
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <SearchSection />
          </div>
          <div className="col-span-2">
            <GoogleMaps />
          </div>
          
               </div>
        </LoadScript>
      </DestinationContext.Provider>
    </SourceContext.Provider>
  );
}