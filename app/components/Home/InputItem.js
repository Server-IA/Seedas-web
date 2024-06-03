'use client'
import React, { useState, useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Image from 'next/image';

function InputItem({ type }) {
  const [value, setValue] = useState(null);
  const [placeholder, setPlaceholder] = useState('Select a location');

  useEffect(() => {
    type === 'source'
      ? setPlaceholder('Pickup Location')
      : setPlaceholder('Dropoff Location');
  }, [type]);

  const getLatAndLng = (place) => {
    console.log(place, type);
    // Implement logic to extract latitude and longitude from the place object
  };

  return (
    <div className="bg-slate-200 p-3 rounded-lg mt-3 flex items-center gap-4">
      <Image src={type === 'source' ? '/source.png' : '/source.png'} width={15} height={15} />

      <GooglePlacesAutocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
        selectProps={{
          value,
          onChange: (place) => {
            getLatAndLng(place, type);
            setValue(place);
          },
          placeholder: placeholder,
          isClearable: true,
          className: 'w-full',
          components: { DropdownIndicator: false },
          styles: {
            control: (provided) => ({
              ...provided,
              backgroundColor: '#000ffff00',
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