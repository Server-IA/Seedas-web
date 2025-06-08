"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

const VehNotificationProd = () => {
  const { user, isLoaded } = useUser();
  const [solicitudesCanceladas, setSolicitudesCanceladas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchSolicitudesCanceladas = async () => {
      try {
        const q = query(
          collection(db, "Solicitudes"),
          where("transportadorId", "==", user.id),
          where("status", "==", "cancelado")
        );

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSolicitudesCanceladas(data);
      } catch (error) {
        console.error("Error al obtener solicitudes canceladas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudesCanceladas();
  }, [isLoaded, user]);

  const handleEliminar = async (id) => {
    try {
      await deleteDoc(doc(db, "Solicitudes", id));
      setSolicitudesCanceladas((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error al eliminar la notificación:", error);
    }
  };

  if (loading) return <p className="text-gray-500">Cargando notificaciones canceladas...</p>;

  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <h3 className="text-lg font-semibold text-[#800020] mb-2">
        ❌ Publicaciones Canceladas
      </h3>
      <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
        {solicitudesCanceladas.length === 0 ? (
          <p className="text-gray-500">No tienes cancelaciones recientes.</p>
        ) : (
          solicitudesCanceladas.map((solicitud) => (
            <div
              key={solicitud.id}
              className="p-3 border rounded bg-red-50 shadow-sm hover:bg-red-100 transition relative"
            >
              <p><strong>🧑 Productor:</strong> {solicitud.productorName || "No especificado"}</p>
              <p><strong>📍 Origen:</strong> {solicitud.source?.name || "No especificado"}</p>
              <p><strong>📍 Destino:</strong> {solicitud.destination?.name || "No especificado"}</p>
               <p><strong>💰 Precio:</strong> ${parseFloat(solicitud.price).toLocaleString("es-CO")} COP</p>              
              <p><strong>📅 Fecha:</strong> {solicitud.createdAt ? new Date(solicitud.createdAt).toLocaleDateString() : "No especificado"}</p>
              <p className="text-red-700 font-medium mt-1">La publicación fue cancelada por el productor.</p>
              <button
                onClick={() => handleEliminar(solicitud.id)}
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

export default VehNotificationProd;

