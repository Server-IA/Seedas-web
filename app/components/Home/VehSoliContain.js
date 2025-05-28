"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import VehSolicitudes from "./VehSolicitudes";
import VehSoliToday from "./VehSoliToday";

const VehSoliContain = () => {
  const { user } = useUser();
  const [solicitudes, setSolicitudes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const q = query(
      collection(db, "Solicitudes"),
      where("transportadorId", "==", user.id)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSolicitudes(data);
    });

    return () => unsubscribe();
  }, [user]);

  const confirmarSolicitud = async (solicitudId, publicacionId) => {
    try {
      await updateDoc(doc(db, "Solicitudes", solicitudId), {
        status: "confirmado",
      });

      await updateDoc(doc(db, "Productores", publicacionId), {
        status: "confirmado",
      });

      setSolicitudes((prev) =>
        prev.map((s) =>
          s.id === solicitudId ? { ...s, status: "confirmado" } : s
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error al confirmar la solicitud:", error);
    }
  };

  const handleConfirmClick = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setShowModal(true);
  };

return (
  <div className="p-4 bg-white rounded shadow-md">
    {/* Solicitudes de Hoy */}
    <div className="mb-6">
      <VehSoliToday />
    </div>

    {/* Título de Solicitudes Generales */}
    <h2 className="text-xl font-semibold mb-4 text-[#800020] mt-4">
      Solicitudes de Transporte Recibidas
    </h2>

    {/* Lista de Solicitudes Generales */}
    <VehSolicitudes
      solicitudes={solicitudes}
      onConfirmar={handleConfirmClick}
    />

    {/* Modal de Confirmación */}
    {showModal && selectedSolicitud && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-md w-80">
          <h3 className="text-lg font-semibold mb-4">Confirmar Solicitud</h3>
          <p className="mb-4">
            ¿Estás seguro de confirmar esta solicitud de transporte?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              onClick={() =>
                confirmarSolicitud(
                  selectedSolicitud.id,
                  selectedSolicitud.publicationId
                )
              }
              className="px-4 py-2 bg-[#800020] text-white rounded hover:bg-[#990022] transition"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
};

export default VehSoliContain;
