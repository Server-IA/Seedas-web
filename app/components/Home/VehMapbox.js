'use client';

import React, { useEffect, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { VehSourceContext } from '../../context/VehSourceContext';
import { VehDestinationContext } from '../../context/VehDestinationContext';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const VehMapbox = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const sourceMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const { source } = useContext(VehSourceContext);
  const { destination } = useContext(VehDestinationContext);

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.2973, 4.5709], // Centro inicial: Colombia
        zoom: 5,
      });
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !source || !destination) return;

    const getRoute = async () => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${source.lng},${source.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        const route = data.routes[0]?.geometry;

        if (!route) {
          console.error('No se pudo obtener la ruta.');
          return;
        }

        // Limpiar capa anterior de ruta
        if (map.getLayer('route')) map.removeLayer('route');
        if (map.getSource('route')) map.removeSource('route');

        // Agregar nueva ruta
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: route,
          },
        });

        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#1d4ed8',
            'line-width': 5,
          },
        });

        // -------------------------
        // MARCADORES ÚNICOS
        // -------------------------

        // SOURCE
        if (sourceMarkerRef.current) {
          sourceMarkerRef.current.remove();
        }

        sourceMarkerRef.current = new mapboxgl.Marker({ color: 'green' })
          .setLngLat([source.lng, source.lat])
          .addTo(map);

        // DESTINATION
        if (destinationMarkerRef.current) {
          destinationMarkerRef.current.remove();
        }

        destinationMarkerRef.current = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([destination.lng, destination.lat])
          .addTo(map);

        // Ajustar vista
        const bounds = new mapboxgl.LngLatBounds();
        route.coordinates.forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds, { padding: 50 });

      } catch (err) {
        console.error('Error al obtener la ruta:', err);
      }
    };

    getRoute();

  }, [source, destination]);

  return <div ref={mapContainerRef} className="w-full h-[400px] rounded-lg shadow" />;
};

export default VehMapbox;



