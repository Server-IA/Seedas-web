"use client";

import { useState } from "react";

const VehSolicitudes = ({ solicitudes, onConfirmar }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!solicitudes || solicitudes.length === 0) {
    return <p className="text-gray-500">No hay solicitudes dirigidas a ti.</p>;
  }

  return (
    <div className="p-4 border rounded bg-white shadow-md mt-4">
      {/* Título con botón de expandir/colapsar */}
      <h3
        className="font-bold mb-4 text-lg cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        Solicitudes ({solicitudes.length})
        <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
      </h3>

      {/* Contenido colapsable */}
      {isOpen && (
        <div
          className={`grid gap-4 ${
            solicitudes.length > 3 ? "max-h-60 overflow-y-auto" : ""
          }`}
        >
          {solicitudes.map((solicitud) => (
            <div
              key={solicitud.id}
              className="border p-4 rounded shadow bg-gray-50"
            >
              <p>
                <strong>Origen:</strong>{" "}
                {solicitud.source?.name || "No especificado"}
              </p>
              <p>
                <strong>Destino:</strong>{" "}
                {solicitud.destination?.name || "No especificado"}
              </p>
              <p>
                <strong>Precio:</strong> ${solicitud.price || "No especificado"}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {solicitud.createdAt
                  ? new Date(solicitud.createdAt).toLocaleDateString()
                  : "No especificado"}
              </p>
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
                  className="mt-2 px-3 py-1 bg-[#800020] text-white text-sm rounded hover:bg-[#990022] transition"
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
