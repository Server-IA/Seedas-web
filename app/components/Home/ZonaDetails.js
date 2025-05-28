"use client";
import React from "react";

const ZonaDetails = ({ transporte, onDesuscribirse }) => {
  return (
    <div className="border p-3 rounded-xl shadow bg-white">
      <p><strong>Origen:</strong> {transporte.source?.name}</p>
      <p><strong>Destino:</strong> {transporte.destination?.name}</p>
      <p><strong>Vehículo:</strong> {transporte.vehicle}</p>
      <p><strong>Teléfono:</strong> {transporte.phone}</p>
      <p><strong>Fecha:</strong> {new Date(transporte.date.seconds * 1000).toLocaleDateString("es-ES", {
        weekday: "long", day: "numeric", month: "long"
      })}</p>
      <p><strong>Asientos disponibles:</strong> {transporte.usuariosDisponibles}</p>

      <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
        <p className="font-semibold">Suscriptores:</p>
        {transporte.suscriptores?.map((sub, index) => (
          <div key={index} className="border-t py-1">
            <p><strong>{sub.nombre}</strong> - {sub.telefono}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onDesuscribirse}
        className="mt-3 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
      >
        Desuscribirme
      </button>
    </div>
  );
};

export default ZonaDetails;
