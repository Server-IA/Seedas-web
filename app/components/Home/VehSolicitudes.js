"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const VehSolicitudes = ({ solicitudes, onConfirmar, cancelarPublicacion }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filtrar solicitudes que no estén canceladas ni finalizadas
  const solicitudesFiltradas = solicitudes
    ? solicitudes.filter((pub) => pub.status !== "cancelado" && pub.status !== "finalizado")
    : [];

  if (solicitudesFiltradas.length === 0) {
    return <p className="text-gray-500">No hay solicitudes dirigidas a ti.</p>;
  }

  return (
    <div className="p-4 border rounded bg-white shadow-md mt-4">
      <h3
        className="font-bold mb-4 text-green-900 text-lg cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        Productores que quieren trabajar contigo ({solicitudesFiltradas.length})
        <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
      </h3>

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
            >
              <p><strong>🧑 Productor:</strong> {solicitud.productorName || "No especificado"}</p>
              <p><strong>📍Origen:</strong> {solicitud.source?.name || "No especificado"}</p>
              <p><strong>📍Destino:</strong> {solicitud.destination?.name || "No especificado"}</p>
              <p><strong>💰Precio:</strong> ${solicitud.price || "No especificado"}</p>
              <p>
                <strong>📅Fecha:</strong>{" "}
                {solicitud.workingHours?.date
                  ? new Date(solicitud.workingHours.date + "T00:00:00").toLocaleDateString("es-CO")
                  : "No especificado"}
              </p>
              <p><strong>Tipo de Mercancía:</strong> {solicitud.merchandise?.type || "No especificado"}</p>
              {solicitud.merchandise?.type === "otros" && (
                <p><strong>Descripción:</strong> {solicitud.merchandise?.description || "No especificado"}</p>
              )}
              <div className="mt-2 flex gap-2">
                {solicitud.status !== "confirmado" && (
                  <button
                    onClick={() => onConfirmar(solicitud)}
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Confirmar
                  </button>
                )}
                <button
                  onClick={() => cancelarPublicacion(solicitud)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehSolicitudes;
