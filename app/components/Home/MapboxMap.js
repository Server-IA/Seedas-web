import React, { useContext, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { SourceContext } from '../../context/SourceContext';
import { DestinationContext } from '../../context/DestinationContext';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const containerStyle = {
  width: '100%',
  height: '450px',
};

function MapboxMap() {
  const { source } = useContext(SourceContext);
  const { destination } = useContext(DestinationContext);
  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // Inicialización del mapa
    if (mapContainerRef.current && !mapInstance.current) {
      mapInstance.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-38.523, -3.745], // Coordenadas iniciales
        zoom: 10,
      });

      mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
      // Validar y manejar source
      if (source && typeof source.lng === 'number' && typeof source.lat === 'number') {
        new mapboxgl.Marker({ color: 'blue' })
          .setLngLat([source.lng, source.lat])
          .addTo(mapInstance.current);
        mapInstance.current.setCenter([source.lng, source.lat]);
      } else if (source) {
        console.error('Invalid source coordinates', source);
      }

      // Validar y manejar destination
      if (destination && typeof destination.lng === 'number' && typeof destination.lat === 'number') {
        new mapboxgl.Marker({ color: 'red' })
          .setLngLat([destination.lng, destination.lat])
          .addTo(mapInstance.current);
        mapInstance.current.setCenter([destination.lng, destination.lat]);
      } else if (destination) {
        console.error('Invalid destination coordinates', destination);
      }
    }
  }, [source, destination]); // Dependencias

  return <div style={containerStyle} ref={mapContainerRef}></div>;
}

export default MapboxMap;
