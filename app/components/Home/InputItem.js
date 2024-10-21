import React, { useState, useEffect, useContext } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from 'mapbox-gl'; 
import Image from 'next/image';
import { SourceContext } from '../../context/SourceContext';
import { DestinationContext } from '../../context/DestinationContext';

function InputItem({ type }) {
  const [placeholder, setPlaceholder] = useState('');
  const { setSource } = useContext(SourceContext);
  const { setDestination } = useContext(DestinationContext);

  useEffect(() => {
    setPlaceholder(type === 'source' ? 'Enter source location' : 'Enter destination location');
  }, [type]);

  useEffect(() => {
    const geocoder = new MapboxGeocoder({
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      placeholder: placeholder,
      types: 'place, address',
      countries: 'us, co',
     
    });

    geocoder.addTo(`#geocoder-${type}`);

    const onResult = (event) => {
      const { result } = event;
      if (result && result.geometry && result.geometry.coordinates) {
        const [lng, lat] = result.geometry.coordinates;
        if (type === 'source') {
          setSource({
            lat,
            lng,
            name: result.place_name,
          });
        } else {
          setDestination({
            lat,
            lng,
            name: result.place_name,
          });
        }
      }
    };

    geocoder.on('result', onResult);
    return () => geocoder.off('result', onResult);
  }, [type, placeholder, setSource, setDestination]);

  return (
    <div className="bg-slate-200 p-3 rounded-lg mt-3 flex items-center gap-4">
      <Image src={type === 'source' ? '/source.png' : '/source.png'} width={15} height={15} alt="Location Icon" />
      <div id={`geocoder-${type}`} className="w-full" />
    </div>
  );
}

export default InputItem;
