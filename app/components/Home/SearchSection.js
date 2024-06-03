import React, { useState, useEffect, useContext } from 'react';
import InputItem from './InputItem';
import { SourceContext } from '../../context/SourceContext';
import { DestinationContext } from '../../context/DestinationContext';
import GoogleMap from './GoogleMaps';
import CarListOptions from './CarListOptions';

function SearchSection() {
  const { source, setSource } = useContext(SourceContext);
  const { destination, setDestination } = useContext(DestinationContext);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (source) {
      console.log(source);
    }
    if (destination) {
      console.log("--", destination);
    }
    // Calculate distance here if needed
    // setDistance(value); // Update distance value if necessary
  }, [source, destination]);

  return (
    <div>
    <div className='p-2 md:-6 border-[2px] rounded-xl'>
      <p className='text-[20px] font-bold'>Necesitas transporte</p>
      <InputItem type='source' />
      <InputItem type='destination' />
      <button className='p-4 bg-black w-full mt-5 text-white rounded-lg'
      onClick={()=>calculateDistance()}>Buscar</button>
      
      {distance ? <CarListOptions distance={distance} /> : null}
    </div>
    <CarListOptions/>
    </div>
  )
}

export default SearchSection