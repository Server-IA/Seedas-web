"use client";

import React, { useEffect, useState, useContext } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { VehUserIdContext } from "../../context/VehUserIdContext";

const VehContainProd = () => {
  const { userId } = useContext(VehUserIdContext);
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchPublicaciones = async () => {
    try {
      const q = query(collection(db, "Transportadores"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPublicaciones(data.filter(pub => pub.status !== "cancelado"));
    } catch (error) {
      console.error("Error al obtener publicaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPublicaciones();
    }
  }, [userId]);

  const cancelarPublicacion = async (id) => {
    try {
      await updateDoc(doc(db, "VehComunitario", id), {
        status: "cancelado",
      });
      setPublicaciones((prev) => prev.filter((pub) => pub.id !== id));
    } catch (error) {
      console.error("Error al cancelar publicación:", error);
    }
  };

  if (loading) return <p className="text-black">Cargando tus publicaciones...</p>;
  if (publicaciones.length === 0) return <p className="text-gray-500">No hay publicaciones activas.</p>;

  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <h2
        onClick={() => setIsOpen(!isOpen)}
        className="text-lg font-semibold text-blue-900 mb-4 cursor-pointer flex justify-between items-center"
      >
        🚚 Mis Vehículos Activos Para Los Productores
        <span className="text-sm">{isOpen ? "▲" : "▼"}</span>
      </h2>

      {isOpen && (
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {publicaciones.map((pub) => (
            <div key={pub.id} className="border border-gray-300 rounded p-4 bg-gray-50">
              <p><strong>Origen:</strong> {pub.source?.name || "No especificado"}</p>
              <p><strong>Destino:</strong> {pub.destination?.name || "No especificado"}</p>
              <p><strong>Fecha:</strong> {pub.workingHours?.date || "Sin fecha"}</p>
              <button
                onClick={() => cancelarPublicacion(pub.id)}
                className="mt-3 px-4 py-2 bg-[#800020] text-white rounded hover:bg-red-900 transition"
              >
                Cancelar Publicación
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehContainProd;

