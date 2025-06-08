"use client";
import React, { useEffect, useState, useContext } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import VehDetails from "./VehDetails";
import { VehUserIdContext } from "../../context/VehUserIdContext";

const VehContainCom = () => {
  const { userId } = useContext(VehUserIdContext);
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserPublications = async () => {
      try {
        const q = query(
          collection(db, "VehComunitario"),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        const publicacionesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Ocultar cancelados
        setPublicaciones(publicacionesData.filter(pub => pub.status !== "cancelado"));
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        setError("Error al cargar las publicaciones. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPublications();
  }, [userId]);

  const handleCancel = (id) => {
    setPublicaciones((prev) => prev.filter((pub) => pub.id !== id));
  };

  if (loading) return <p className="text-black">Cargando publicaciones...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (publicaciones.length === 0) return <p className="text-black">No tienes publicaciones disponibles.</p>;

  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <h3
        className="font-bold text-blue-900 mb-4 text-lg cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        🚚 Mis Publicaciones de Transporte Comunitario
        <span>{isOpen ? "▲" : "▼"}</span>
      </h3>
      {isOpen && (
        <div className="grid gap-4 max-h-60 overflow-y-auto pr-2">
          {publicaciones.map((publicacion) => (
            <VehDetails
              key={publicacion.id}
              publicacion={publicacion}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VehContainCom;

