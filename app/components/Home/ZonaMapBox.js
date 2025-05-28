// components/ZonaMapbox.js
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'TU_MAPBOX_ACCESS_TOKEN';

const ZonaMapbox = ({ origin, destination }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!origin || !destination) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [origin.lng, origin.lat],
      zoom: 6,
    });

    new mapboxgl.Marker({ color: 'green' })
      .setLngLat([origin.lng, origin.lat])
      .addTo(map);

    new mapboxgl.Marker({ color: 'red' })
      .setLngLat([destination.lng, destination.lat])
      .addTo(map);

    return () => map.remove();
  }, [origin, destination]);

  return <div ref={mapContainerRef} className="h-96 w-full rounded-xl shadow" />;
};

export default ZonaMapbox;
