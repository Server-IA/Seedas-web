// pages/TransportPage.js
'use client';

import React, { useState } from 'react';
import { VehSourceContext } from '../context/VehSourceContext';
import { VehRadiusContext } from '../context/VehRadiusContext';
import VehInputItem from '../components/Home/VehInputItem';
import VehMapbox from '../components/Home/VehMapbox';

export default function TransportPage() {
  const [source, setSource] = useState(null);
  const [radius, setRadius] = useState(5);  // Set default radius to 5 km

  return (
    <VehSourceContext.Provider value={{ source, setSource }}>
      <VehRadiusContext.Provider value={{ radius, setRadius }}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <VehInputItem type="source" />  {/* Input for address */}
          </div>
          <div>
            <VehMapbox />  {/* Map that displays the selected address */}
          </div>
        </div>
      </VehRadiusContext.Provider>
    </VehSourceContext.Provider>
  );
}
