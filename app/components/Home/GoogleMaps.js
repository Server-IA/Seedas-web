'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DirectionsRenderer, GoogleMap, MarkerF, OverlayView, useJsApiLoader } from '@react-google-maps/api';
import { SourceContext } from '../../context/SourceContext';
import { DestinationContext } from '../../context/DestinationContext';

const containerStyle = {
  width: '100%',
  height: '450px'
};

const defaultCenter = {
  lat: -3.745,
  lng: -38.523
};

function GoogleMaps() {
  const { source } = useContext(SourceContext);
  const { destination } = useContext(DestinationContext);

  const [center, setCenter] = useState(defaultCenter);
  const [map, setMap] = useState(null);
  const [directionRoutePoints, setDirectionRoutePoints] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  useEffect(() => {
    if (source && map) {
      map.panTo({ lat: source.lat, lng: source.lng });
      setCenter({ lat: source.lat, lng: source.lng });
      if (destination) {
        directionRoute();
      }
    }
  }, [source]);

  useEffect(() => {
    if (destination && map) {
      setCenter({ lat: destination.lat, lng: destination.lng });
      if (source) {
        directionRoute();
      }
    }
  }, [destination]);

  const directionRoute = () => {
    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route({
      origin: { lat: source.lat, lng: source.lng },
      destination: { lat: destination.lat, lng: destination.lng },
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        setDirectionRoutePoints(result);
      } else {
        console.error('Error fetching directions', result);
      }
    });
  };

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, [center]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{ mapId: '89587ae7dea7e34' }}
    >
      {source && (
        <MarkerF position={{ lat: source.lat, lng: source.lng }} icon={{ url: "/source.png", scaledSize: { width: 20, height: 20 } }}>
          <OverlayView position={{ lat: source.lat, lng: source.lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <div className='p-2 bg-white font-bold inline-block'>
              <p className='text-black text-[18px]'>{source.label}</p>
            </div>
          </OverlayView>
        </MarkerF>
      )}
      {destination && (
        <MarkerF position={{ lat: destination.lat, lng: destination.lng }} icon={{ url: "/source.png", scaledSize: { width: 20, height: 20 } }}>
          <OverlayView position={{ lat: destination.lat, lng: destination.lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <div className='p-2 bg-white font-bold inline-block'>
              <p className='text-black text-[18px]'>{destination.label}</p>
            </div>
          </OverlayView>
        </MarkerF>
      )}
      {directionRoutePoints && (
        <DirectionsRenderer directions={directionRoutePoints} options={{ polylineOptions: { strokeColor: '#000', strokeWeight: 5 }, suppressMarkers: true }} />
      )}
    </GoogleMap>
  ) : <></>;
}

export default GoogleMaps;
