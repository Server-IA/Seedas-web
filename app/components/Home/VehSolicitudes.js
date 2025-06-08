"use client";

import { useState } from "react";

const VehSolicitudes = ({ solicitudes, onConfirmar }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filtrar solicitudes que no estén canceladas
  const solicitudesFiltradas = solicitudes
    ? solicitudes.filter((pub) => pub.status !== "cancelado")
    : [];

  if (solicitudesFiltradas.length === 0) {
    return <p className="text-gray-500">No hay solicitudes dirigidas a ti.</p>;
  }

  return (
    
    <div className="p-4 border rounded bg-white shadow-md mt-4">
      
      {/* Título con botón de expandir/colapsar */}
      <h3
        className="font-bold mb-4 text-green-900 text-lg cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
       productores que quieren trabajar contigo ({solicitudesFiltradas.length})
        <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
      </h3>

      {/* Contenido colapsable */}
      {isOpen && (
        <div
          className={`grid gap-4 ${
            solicitudesFiltradas.length > 3 ? "max-h-60 overflow-y-auto" : ""
          }`}
        >
          {solicitudesFiltradas.map((solicitud) => (
            <div
              key={solicitud.id}
              className="border p-4 rounded shadow bg-gray-50"
            > <p>
                <strong>🧑 Productor:</strong> 
                {solicitud.productorName || "No especificado"}</p>
              <p>
                <strong>📍Origen:</strong>{" "}
                {solicitud.source?.name || "No especificado"}
              </p>
              <p>
                <strong>📍Destino:</strong>{" "}
                {solicitud.destination?.name || "No especificado"}
              </p>
              <p>
                <strong>💰Precio:</strong> ${solicitud.price || "No especificado"}
              </p>
               <p>
                <strong>📅Fecha:</strong>{" "}
                {solicitud.createdAt
                  ? new Date(solicitud.createdAt).toLocaleDateString()
                  : "No especificado"}
              </p>
              <p>
                <strong>Tipo de Mercancía:</strong> {solicitud.merchandise?.type || "No especificado"}
              </p>
               {solicitud.merchandise?.type === "otros" && (
             <p><strong>Descripción:</strong> {solicitud.merchandise?.description || "No especificado"}</p>
               )}
             
              <p>
                <strong>Estado:</strong>
                <span
                  className={`ml-2 font-semibold ${
                    solicitud.status === "confirmado"
                      ? "text-green-600"
                      : "text-yellow-500"
                  }`}
                >
                  {solicitud.status}
                </span>
              </p>
              {solicitud.status !== "confirmado" && (
                <button
                  onClick={() => onConfirmar(solicitud)}
                  className="px-4 py-2 bg-[#166d13] text-white rounded hover:bg-[#63dd44] transition"
                >
                  Confirmar Solicitud
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehSolicitudes;
