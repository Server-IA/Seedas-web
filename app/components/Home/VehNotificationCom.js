"use client";

import React, { useEffect, useState, useContext } from "react";
import { collection, query, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { VehUserIdContext } from "../../context/VehUserIdContext";

const VehNotificationCom = () => {
  const { VehuserId } = useContext(VehUserIdContext);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    if (!VehuserId) return;

    const q = query(collection(db, "VehComunitarios"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const nuevas = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const mensaje = data?.mensajeParaTransportador;
        const transportadorId = data?.solicitud?.transportadorId;

        const cumple = mensaje && transportadorId === VehuserId && data.status === "cancelado";

        if (cumple) {
          nuevas.push({
            id: doc.id,
            mensaje: mensaje.texto,
            timestamp: mensaje.timestamp,
            productor: data.userName,
            origen: data.source?.name,
            destino: data.destination?.name,
            tipo: data.merchandise?.type,
            descripcion: data.merchandise?.description,
            precio: data.price,
            fecha: data.workingHours?.date,
            vehiculo: data.vehicle,
          });
        }
      });

      setNotificaciones(nuevas);
    });

    return () => unsubscribe();
  }, [VehuserId]);

  const handleEliminar = async (id) => {
    try {
      await deleteDoc(doc(db, "VehComunitarios", id));
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error al eliminar notificación comunitaria:", error);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <h3 className="text-lg font-semibold text-[#800020] mb-2">
        ❌ Usuarios que cancelaron el uso de tu servicio comunitario
      </h3>
      <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
        {notificaciones.length === 0 ? (
          <p className="text-gray-500 text-sm">Sin notificaciones de cancelación.</p>
        ) : (
          notificaciones.map((noti) => (
            <div
              key={noti.id}
              className="border border-gray-300 p-4 rounded bg-gray-50 relative"
            >
              <p className="text-red-700 font-semibold mb-2">{noti.mensaje}</p>
              <p><strong>🧑 Usuario:</strong> {noti.productor}</p>
              <p><strong>🚚 Vehículo:</strong> {noti.vehiculo}</p>
              <p><strong>📦 Mercancía:</strong> {noti.tipo === "otros" ? `${noti.tipo} - ${noti.descripcion}` : noti.tipo}</p>
              <p><strong>💰 Precio:</strong> ${parseFloat(noti.precio).toLocaleString("es-CO")} COP</p>
              <p><strong>📍 Origen:</strong> {noti.origen}</p>
              <p><strong>📍 Destino:</strong> {noti.destino}</p>
              <p><strong>📅 Fecha:</strong> {noti.fecha}</p>
              <p className="text-xs text-gray-500 mt-2">
                Notificado el {new Date(noti.timestamp).toLocaleString("es-CO")}
              </p>
              <button
                onClick={() => handleEliminar(noti.id)}
                className="mt-3 px-4 py-1 text-white rounded bg-[#800020] hover:bg-red-900 transition text-sm"
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VehNotificationCom;

