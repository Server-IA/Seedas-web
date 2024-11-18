'use client';
import React, { useState, useEffect, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { SourceContext } from '../../context/SourceContext';
import { DestinationContext } from '../../context/DestinationContext';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const ZoneMap = () => {
  const [map, setMap] = useState(null); // Estado para almacenar la instancia del mapa
  const [center, setCenter] = useState([-74.08175, 4.60971]); // Centro predeterminado (Bogotá)
  const { sourceLocation } = useContext(SourceContext); // Ubicación fuente desde el contexto
  const { destinationLocation } = useContext(DestinationContext); // Ubicación destino desde el contexto

  useEffect(() => {
    // Crear la instancia del mapa solo si aún no existe
    if (!map) {
      const mapInstance = new mapboxgl.Map({
        container: 'map', // ID del contenedor HTML
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 13,
      });

      // Añadir el geocodificador al mapa
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: 'Buscar ubicaciones...',
      });

      mapInstance.addControl(geocoder);

      setMap(mapInstance); // Guardar la instancia del mapa
    }

    // Limpiar el mapa cuando se desmonte el componente
    return () => map?.remove();
  }, [map, center]);

  useEffect(() => {
    if (map && sourceLocation && destinationLocation) {
      // Actualiza el mapa con las ubicaciones seleccionadas
      map.flyTo({ center: sourceLocation, zoom: 12 });
      // Aquí puedes agregar lógica para marcar las ubicaciones en el mapa si es necesario
    }
  }, [map, sourceLocation, destinationLocation]);

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default ZoneMap;
