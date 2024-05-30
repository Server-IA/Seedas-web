"use client"
import Image from 'next/image';
import React, { useState,useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

function InputItem ({ type })  {
  const [value, setValue] = useState(null);
  const [placeholder, setPlaceholder] = useState('Select a location');

  useEffect(()=>{
    type=='source'
    ?setPlaceholder('pickup location')
    :setPlaceholder('Dropoff Location')

  },[])

  const getLatAndLng = (place, type) => {
    console.log(place, type);
    // Implement the logic to get latitude and longitude from the place object
  };

  return (
    <div className="bg-slate-200 p-3 rounded-lg mt-3 flex items-center gap-4">
      <Image src={type === 'source' ? '/source.png' : '/source.png'} width={15} height={15} />

      <GooglePlacesAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
        selectProps={{
          value,
          onChange: (place) => { getLatAndLng(place, type);
            setValue(place);
           
          },
          placeholder: 'pickup location',
          isClearable: true,
          className: 'w-full',
          components: {
            DropdownIndicator:false // Hide the dropdown indicator
          },
          styles: {
            control: (provided) => ({
              ...provided,
              backgroundColor: '000ffff00',
              border: 'none',
              boxShadow: 'none',
            }),
          },
        }}
      />
    </div>
  );
};

export default InputItem;
