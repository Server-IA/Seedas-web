"use client";
import React, { useState } from 'react';
import SearchSection from '../components/Home/SearchSection';
import GoogleMaps from '../components/Home/GoogleMaps';
import { SourceContext } from '../context/SourceContext';
import { DestinationContext } from '../context/DestinationContext';

export default function indexPage() {
  const [source, setSource] = useState([])
  const [destination, setDestination] = useState([])
  
  return (
    <SourceContext.Provider value={{ source, setSource }}>
      <DestinationContext.Provider value={{ destination, setDestination }}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <SearchSection />
          </div>
          <div className="col-span-2">
            <GoogleMaps />
          </div>
         
        </div>
      </DestinationContext.Provider>
    </SourceContext.Provider>
  );
}
