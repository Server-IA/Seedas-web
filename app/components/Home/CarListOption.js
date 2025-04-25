"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { db } from "../../firebase/config";
import TransporterDetails from "./TransporterDetails";

const CarListOption = ({ setSelectedCar }) => {
  const { user } = useUser();
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Transportadores"));
        const publicacionesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const publicacionesFiltradas = publicacionesData.filter(
          (publicacion) => publicacion.userId !== user?.id
        );

        setPublicaciones(publicacionesFiltradas);
      } catch (error) {
        console.error("Error al obtener los datos de Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, [user]);

  if (loading) {
    return <p className="text-sm text-gray-500 select-none">Cargando datos...</p>;
  }

  return (
    <div className="p-2 border rounded-md bg-white shadow-md w-auto text-sm select-none">
      <div className="grid gap-2 overflow-y-auto max-h-80"> {/* ajustado para mostrar 2 publicaciones */}
        {publicaciones.length > 0 ? (
          publicaciones.map((publicacion) => (
            <div
              key={publicacion.id}
              className={`cursor-pointer p-2 rounded-md transition-all duration-200 
              ${selectedId === publicacion.id ? "border-2 border-black" : "hover:bg-gray-200"}`}
              onClick={() => {
                setSelectedCar(publicacion);
                setSelectedId(publicacion.id);
              }}
            >
              <TransporterDetails publicacion={publicacion} />
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
};

export default CarListOption;
