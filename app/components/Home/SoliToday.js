"use client";

import { useEffect, useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const SoliToday = ({ solicitudes }) => {
  const [actuales, setActuales] = useState([]);

  useEffect(() => {
    const today = new Date().toLocaleDateString();

    const filtradas = solicitudes.filter((sol) => {
      const fecha = sol.createdAt
        ? new Date(sol.createdAt).toLocaleDateString()
        : "";
      return (
        sol.status !== "cancelado" &&
        sol.status !== "finalizado" &&
       
        fecha === today
      );
    });

    setActuales(filtradas);
  }, [solicitudes]);

  const handleFinalizar = async (id) => {
    try {
      const ref = doc(db, "Solicitudes", id);
      await updateDoc(ref, {
        status: "finalizado",
      
      });
      // Opcional: actualiza estado localmente sin recargar
      setActuales((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error al finalizar:", error);
    }
  };

  if (actuales.length === 0) {
    return (
      <p className="text-gray-500 text-sm mt-4">
        No tienes solicitudes para hoy.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {actuales.map((sol) => (
        <div
          key={sol.id}
          className="border p-4 rounded shadow bg-white space-y-2"
        >
          <p><strong>🧑 Transportador:</strong> {sol.transportadorName}</p>
          <p><strong>📍 Origen:</strong> {sol.source?.name}</p>
          <p><strong>📍 Destino:</strong> {sol.destination?.name}</p>
          <p><strong>💰 Precio:</strong> ${Number(sol.price).toLocaleString("es-CO", { style: "currency", currency: "COP" })}</p>
          <p><strong>📅 Fecha:</strong> {new Date(sol.createdAt).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> {sol.status}</p>

          {sol.enCamino === true && (
            <>
              <p className="text-green-700 font-semibold">
                El transportador ya va en camino 🚚
              </p>
              <button
                onClick={() => handleFinalizar(sol.id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Finalizar servicio
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SoliToday;
