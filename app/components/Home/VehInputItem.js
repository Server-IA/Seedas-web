// components/Home/VehInputItem.js
'use client';

import React, { useEffect, useRef, useContext } from 'react';
import { VehSourceContext } from '../../context/VehSourceContext';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

function VehInputItem({ type }) {
  const { setSource } = useContext(VehSourceContext);
  const geocoderContainer = useRef(null);

  useEffect(() => {
    if (geocoderContainer.current) {
      const geocoder = new MapboxGeocoder({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
        placeholder: type === 'source' ? 'Enter source location' : 'Enter radius',
        types: 'place, address',
        countries: 'us,co',  // Limit to certain countries if necessary
        proximity: { longitude: -74.08175, latitude: 4.60971 },  // Default to Bogotá
        mapboxgl,
      });

      geocoder.addTo(geocoderContainer.current);
      
      geocoder.on('result', (e) => {
        const { place_name: text, center } = e.result;
        const [lng, lat] = center;
        setSource({ lat, lng, text });  // Update context with new location
      });
    }
  }, [type, setSource]);

  return <div ref={geocoderContainer} className="w-full" />;
}

export default VehInputItem;

