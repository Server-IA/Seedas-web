// components/Home/VehMapbox.js
'use client';

import React, { useEffect, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { VehSourceContext } from '../../context/VehSourceContext';
import { VehRadiusContext } from '../../context/VehRadiusContext';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { require } from '@turf/turf';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

function VehMapbox() {
  const { source } = useContext(VehSourceContext);
  const { radius } = useContext(VehRadiusContext);
  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);
  const circleLayerId = 'radius-circle';

  useEffect(() => {
    if (!mapInstance.current && source?.lat && source?.lng) {
      mapInstance.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [source.lng, source.lat],
        zoom: 12,
      });
    }

    const map = mapInstance.current;

    if (source && source.lat && source.lng) {
      map.on('load', () => {
        const radiusInMeters = radius * 1000;  // Convert kilometers to meters
        if (map.getSource(circleLayerId)) {
          map.getSource(circleLayerId).setData(getCircleGeoJSON(source, radiusInMeters));
        } else {
          map.addSource(circleLayerId, {
            type: 'geojson',
            data: getCircleGeoJSON(source, radiusInMeters),
          });

          map.addLayer({
            id: circleLayerId,
            type: 'fill',
            source: circleLayerId,
            paint: {
              'fill-color': '#0074D9',
              'fill-opacity': 0.3,
            },
          });
        }
      });
    }
  }, [source, radius]);

  const getCircleGeoJSON = (center, radius) => {
    const turf = require('@turf/turf');
    const circle = turf.circle([center.lng, center.lat], radius / 1000, { steps: 64, units: 'kilometers' });
    return circle;
  };

  return <div style={{ width: '100%', height: '450px' }} ref={mapContainerRef}></div>;
}

export default VehMapbox;

/*import React, { useContext, useEffect, useRef, useState } from 'react';  
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
  const [routeLayerAdded, setRouteLayerAdded] = useState(false);  

  useEffect(() => {  
    if (mapContainerRef.current && !mapInstance.current) {  
      mapInstance.current = new mapboxgl.Map({  
        container: mapContainerRef.current,  
        style: 'mapbox://styles/mapbox/streets-v11',  
        center: [-38.523, -3.745], // initial center  
        zoom: 10,  
      });  

      mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');  
    }  
  }, []);  

  useEffect(() => {  
    if (mapInstance.current) {  
      // Check if source coordinates are valid  
      if (source && typeof source.lng === 'number' && typeof source.lat === 'number') {  
        new mapboxgl.Marker({ color: 'blue' })  
          .setLngLat([source.lng, source.lat])  
          .addTo(mapInstance.current);  
        mapInstance.current.setCenter([source.lng, source.lat]);  
      } else {  
        console.error('Invalid source coordinates', source);  
      }  

      // Check if destination coordinates are valid  
      if (destination && typeof destination.lng === 'number' && typeof destination.lat === 'number') {  
        new mapboxgl.Marker({ color: 'red' })  
          .setLngLat([destination.lng, destination.lat])  
          .addTo(mapInstance.current);  
        mapInstance.current.setCenter([destination.lng, destination.lat]);  
      } else {  
        console.error('Invalid destination coordinates', destination);  
      }  
    }  
  }, [source, destination]);  

  return <div style={containerStyle} ref={mapContainerRef}></div>;  
}  

export default MapboxMap; */
