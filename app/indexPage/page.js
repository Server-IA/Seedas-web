"use client";
import React, { useState } from 'react';
import SearchSection from "../components/Home/SearchSection";
import GoogleMaps from "../components/Home/GoogleMaps";

export default function () {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  
  return (
    
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <SearchSection />
          </div>
          <div className="col-span-2">
            <GoogleMaps />
          </div>
        </div>

  );
}
