"use client";

import React, { useEffect, useContext } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { VehSourceContext } from "../../context/VehSourceContext";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const VehInputOrigen = () => {
  const { setSource } = useContext(VehSourceContext);

  useEffect(() => {
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: "Ingresa la dirección de origen",
    });

    geocoder.addTo("#geocoder-container-origin");

    geocoder.on("result", (e) => {
      const { center } = e.result;
      setSource({ lng: center[0], lat: center[1] });
    });

    return () => {
      const geocoderEl = document.getElementById("geocoder-container-origin");
      if (geocoderEl) {
        geocoderEl.innerHTML = ""; // Limpiar el contenedor
      }
    };
  }, [setSource]);

  return (
    <div className="mt-4">
      <p className="mb-2 font-semibold text-black">Dirección de Origen:</p>
      <div id="geocoder-container-origin" className="w-full rounded shadow" />
    </div>
  );
};

export default VehInputOrigen;
