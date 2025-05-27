"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";

const Solicitudes= () => {
  const { user, isLoaded } = useUser();
  const [solicitudesHoy, setSolicitudesHoy] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener la fecha actual a las 00:00:00
  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.getTime();
  };

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchSolicitudesHoy = async () => {
      try {
        // Consulta solo las solicitudes de este transportador
        const q = query(
          collection(db, "Solicitudes"),
          where("productorId", "==", user.id)
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
        console.error("Error al obtener solicitudes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitudesHoy();
  }, [isLoaded, user]);

  if (loading) {
    return <div className="p-4 text-gray-500 animate-pulse">Cargando solicitudes...</div>;
  }

  if (solicitudesHoy.length === 0) {
    return <div className="p-4 text-gray-500">No tienes solicitudes programadas para hoy.</div>;
  }

  return (
    <div className="p-4 bg-white border rounded shadow-md">
      <h2 className="text-xl font-semibold text-[#800020] mb-4">Solicitudes para Hoy</h2>
      {solicitudesHoy.map((solicitud) => (
        <div
          key={solicitud.id}
          className="p-4 border rounded bg-gray-50 shadow-sm hover:bg-gray-100 transition mb-2"
        >
          <p><strong>Origen:</strong> {solicitud.source?.name || "N/A"}</p>
          <p><strong>Destino:</strong> {solicitud.destination?.name || "N/A"}</p>
          <p><strong>Precio:</strong> ${solicitud.price || "N/A"}</p>
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
      ))}
    </div>
  );
};


export default Solicitudes;
