"use client";

import React, { useState } from 'react';
import SearchSection from '../components/Home/SearchSection';
import { SourceContext } from '../context/SourceContext';
import { DestinationContext } from '../context/DestinationContext';
import MapboxMap from '../components/Home/MapboxMap';

export default function indexPage() {
    const [source, setSource] = useState([]);
    const [destination, setDestination] = useState([]);

    return (
        <SourceContext.Provider value={{ source, setSource }}>
            <DestinationContext.Provider value={{ destination, setDestination }}>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <SearchSection />
                    </div>
                    <div className="col-span-2">
                        <MapboxMap /> 
                    </div>
                </div>
            </DestinationContext.Provider>
        </SourceContext.Provider>
    );
}
