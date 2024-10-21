'use client';
import React, { useContext, useEffect, useState } from 'react';
import InputItem from './InputItem';
import { SourceContext } from '../../context/SourceContext';
import { DestinationContext } from '../../context/DestinationContext';
import MapboxMap from './MapboxMap';
import CarListOptions from './CarListOptions';

function SearchSection() {
  const { source } = useContext(SourceContext);
  const { destination } = useContext(DestinationContext);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (source && destination) {
      const R = 6371; // Radio de la Tierra en km
      const dLat = (destination.lat - source.lat) * (Math.PI / 180);
      const dLng = (destination.lng - source.lng) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(source.lat * (Math.PI / 180)) *
          Math.cos(destination.lat * (Math.PI / 180)) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = R * c; // Distancia en km
      setDistance(dist);
    }
  }, [source, destination]);

  return (
    <div>
      <div className='p-2 md:-6 border-[2px] rounded-xl'>
        <p className='text-[20px] font-bold'>Enter your locations</p>
        <InputItem type='source' />
        <InputItem type='destination' />
        {distance && <p>Distance: {distance.toFixed(2)} km</p>}
      </div>
     <CarListOptions/>
    </div>
  );
}

export default SearchSection;

