'use client';

import React, { useEffect, useRef, useContext } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Image from 'next/image';
import { SourceContext } from '../../context/SourceContext';
import { DestinationContext } from '../../context/DestinationContext';

function InputItem({ type }) {
    const { setSource } = useContext(SourceContext);
    const { setDestination } = useContext(DestinationContext);
    const geocoderRef = useRef(null);

    useEffect(() => {
        if (!geocoderRef.current) {
            geocoderRef.current = new MapboxGeocoder({
                accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
                placeholder: type === 'source' ? 'Enter source location' : 'Enter destination location',
                types: 'place, address',
                countries: 'us, co',
            });

            geocoderRef.current.addTo(`#geocoder-${type}`);
            geocoderRef.current.on('result', (event) => {
                const { result } = event;
                if (result?.geometry?.coordinates) {
                    const [lng, lat] = result.geometry.coordinates;
                    if (type === 'source') {
                        setSource({ lat, lng, name: result.place_name });
                    } else {
                        setDestination({ lat, lng, name: result.place_name });
                    }
                }
            });
        }
        return () => {
            if (geocoderRef.current) {
                geocoderRef.current.clear(); // Limpia el componente al desmontar
            }
        };
    }, [type, setSource, setDestination]);

    return (
        <div 
            className="bg-slate-200 p-3 rounded-lg mt-3 flex items-center gap-4 relative" // Añadido `relative`
        >
            <Image src="/source.png" width={15} height={15} alt="Location Icon" />
            <div 
                id={`geocoder-${type}`} 
                className="w-full z-10" // Añadido `z-10` para priorizar el autocompletar
            />
        </div>
    );
}

export default InputItem;

