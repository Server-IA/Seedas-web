'use client';
import React, { useState, useEffect, useContext } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { SourceContext } from '../../context/SourceContext';
import { DestinationContext } from '../../context/DestinationContext';

const InputItemTranspor = ({ placeholder, setLocation }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSuggestionSelect = (result, lat, lng, text) => {
    setInputValue(text);
    setLocation({ lat, lng, text }); // Guardar la ubicación seleccionada
  };

  return (
    <div className="bg-slate-200 p-3 rounded-lg mt-3 flex items-center gap-4">
      <MapboxGeocoder
        publicKey={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        onSuggestionSelect={handleSuggestionSelect}
        query={inputValue}
        resetSearch={false}
        placeholder={placeholder}
        country="co"
        inputClass="w-full p-2 rounded"
      />
    </div>
  );
};

export default InputItemTranspor;
