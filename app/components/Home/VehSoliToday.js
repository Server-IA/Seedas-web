"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";

const VehSoliToday = () => {
  const { user, isLoaded } = useUser();
  const [solicitudesHoy, setSolicitudesHoy] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  };

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchSolicitudesHoy = async () => {
      try {
        const q = query(
          collection(db, "Solicitudes"),
          where("transportadorId", "==", user.id)
        );

        const querySnapshot = await getDocs(q);
        const today = getTodayDate();

        const data = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((doc) => {
            if (!doc.createdAt) return false;
            const createdDate = new Date(doc.createdAt);
            createdDate.setHours(0, 0, 0, 0);
            return createdDate.getTime() === today;
          });

        setSolicitudesHoy(data);
      } catch (error) {
        console.error("Error al obtener solicitudes de hoy:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudesHoy();
  }, [isLoaded, user]);

  if (loading) return <p className="text-gray-500">Cargando solicitudes de hoy...</p>;

  return (
    <div className="p-4 border rounded bg-white shadow-md mt-4">
      <h3 className="text-lg font-semibold text-[#800020] mb-2">
        📅 Solicitudes para Hoy ({new Date().toLocaleDateString()})
      </h3>
      {solicitudesHoy.length === 0 ? (
        <p className="text-gray-500">No tienes solicitudes programadas para hoy.</p>
      ) : (
        solicitudesHoy.map((solicitud) => (
          <div
            key={solicitud.id}
            className="p-3 border rounded bg-gray-50 shadow-sm hover:bg-gray-100 transition mb-2"
          >
            <p><strong>Origen:</strong> {solicitud.source?.name || "No especificado"}</p>
            <p><strong>Destino:</strong> {solicitud.destination?.name || "No especificado"}</p>
            <p><strong>Precio:</strong> ${solicitud.price || "No especificado"}</p>
            <p><strong>Fecha de publicación:</strong> {solicitud.createdAt ? new Date(solicitud.createdAt).toLocaleDateString() : "No especificado"}</p>
            <p>
              <strong>Estado:</strong>{" "}
              <span
                className={`${
                  solicitud.status === "confirmado" ? "text-green-600" : "text-yellow-500"
                } font-semibold`}
              >
                {solicitud.status}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default VehSoliToday;
