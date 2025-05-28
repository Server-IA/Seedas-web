"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useUser } from "@clerk/nextjs";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const ZonaVehCard = ({ transporte }) => {
  const { user } = useUser();
  const [telefono, setTelefono] = useState("");
  const [suscribiendo, setSuscribiendo] = useState(false);
  const [asientos, setAsientos] = useState(transporte.usuariosDisponibles);
  const [suscriptores, setSuscriptores] = useState(transporte.suscriptores || []);
  const mapContainer = useRef(null);
  const map = useRef(null);

  const drawRoute = async () => {
    const { source, destination } = transporte;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${source.lng},${source.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    const response = await fetch(url);
    const data = await response.json();
    const route = data.routes[0].geometry;

    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: route,
      },
    });

    map.current.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#1d4ed8",
        "line-width": 4,
      },
    });
  };

  useEffect(() => {
    if (
      !transporte.source?.lng ||
      !transporte.source?.lat ||
      !transporte.destination?.lng ||
      !transporte.destination?.lat
    ) {
      console.warn("No hay coordenadas para el mapa");
      return;
    }

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [transporte.source.lng, transporte.source.lat],
        zoom: 10,
      });

      new mapboxgl.Marker({ color: "green" })
        .setLngLat([transporte.source.lng, transporte.source.lat])
        .setPopup(new mapboxgl.Popup().setText(`Origen: ${transporte.source.name}`))
        .addTo(map.current);

      new mapboxgl.Marker({ color: "red" })
        .setLngLat([transporte.destination.lng, transporte.destination.lat])
        .setPopup(new mapboxgl.Popup().setText(`Destino: ${transporte.destination.name}`))
        .addTo(map.current);

      map.current.on("load", drawRoute);
    }
  }, [transporte]);

  const handleSuscribirse = async () => {
    if (!user || !telefono) {
      alert("Debes ingresar tu teléfono.");
      return;
    }

    try {
      setSuscribiendo(true);
      const transporteRef = doc(db, "VehComunitario", transporte.id);

      const nuevoSuscriptor = {
        userId: user.id,
        nombre: user.fullName,
        telefono,
        fechaSuscripcion: new Date(),
      };

      await updateDoc(transporteRef, {
        suscriptores: arrayUnion(nuevoSuscriptor),
        usuariosDisponibles: increment(-1),
      });

      setAsientos(asientos - 1);
      setSuscriptores((prev) => [...prev, nuevoSuscriptor]);
      setTelefono("");
      alert("Suscripción exitosa");
    } catch (error) {
      console.error("Error al suscribirse:", error);
      alert("Error al suscribirse.");
    } finally {
      setSuscribiendo(false);
    }
  };

  return (
    <div className="border p-3 rounded-xl shadow bg-gray-100 space-y-2">
      <p><strong>Origen:</strong> {transporte.source?.name || "No especificado"}</p>
      <p><strong>Destino:</strong> {transporte.destination?.name || "No especificado"}</p>
      <p><strong>Vehículo:</strong> {transporte.vehicle || "No especificado"}</p>
      <p>
        Precio:{" "}
        {transporte.price !== undefined && transporte.price !== null
          ? `$${transporte.price.toFixed(2)} pesos`
          : "No disponible"}
      </p>
      <p><strong>Fecha:</strong> {new Date(transporte.date.seconds * 1000).toLocaleDateString("es-ES", {
        weekday: "long", day: "numeric", month: "long"
      })}</p>
      <p><strong>Asientos disponibles:</strong> {asientos}</p>

      <div className="mt-2">
        <input
          type="text"
          placeholder="Tu teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
          className="w-full border p-1 rounded mb-2"
          inputMode="numeric"
        />
        <button
          onClick={handleSuscribirse}
          disabled={asientos <= 0 || suscribiendo}
          className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {suscribiendo ? "Enviando..." : "Suscribirse"}
        </button>
      </div>

      {suscriptores.length > 0 && (
        <div className="mt-2 text-sm bg-white p-2 rounded">
          <p className="font-semibold">Suscriptores:</p>
          {suscriptores.map((sub, index) => (
            <div key={index} className="border-t py-1">
              <p><strong>{sub.nombre}</strong> - {sub.telefono}</p>
            </div>
          ))}
        </div>
      )}

      <div ref={mapContainer} className="mt-4 h-64 w-full rounded-lg overflow-hidden" />
    </div>
  );
};

export default ZonaVehCard;
