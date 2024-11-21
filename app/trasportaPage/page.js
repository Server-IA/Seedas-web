'use client';

import React, { useState } from 'react';
import { VehSourceContext } from '../context/VehSourceContext';
import { VehRadiusContext } from '../context/VehRadiusContext';
import VehMapbox from '../components/Home/VehMapbox';
import VehSearchSection from '../components/Home/VehSearchSection';

export default function TransportPage() {
  const [source, setSource] = useState(null);
  const [radius, setRadius] = useState(5);  // Set default radius to 5 km

  return (
    <VehSourceContext.Provider value={{ source, setSource }}>
      <VehRadiusContext.Provider value={{ radius, setRadius }}>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <VehSearchSection />
                    </div>
                    <div className="col-span-2">
                        <VehMapbox radius ={radius}/> 
                    </div>
                </div>
      </VehRadiusContext.Provider>
    </VehSourceContext.Provider>
  );
}
