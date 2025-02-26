"use client";
import React, { useEffect, useState, useContext } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import Details from "./Details";
import { UserIdContext } from "../../context/UserIdContext"; // Importa el contexto

const Contain = () => {
  const { userId } = useContext(UserIdContext); // Obtiene el userId desde el contexto
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserPublications = async () => {
      try {
        const q = query(collection(db, "Productores"),where("userId.userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const publicacionesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPublicaciones(publicacionesData);
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        setError("Error al cargar las publicaciones. Por favor, intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPublications();
  }, [userId]);

  if (loading) return <p className="text-gray-600">Cargando publicaciones...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (publicaciones.length === 0) return <p className="text-gray-600">No tienes publicaciones disponibles.</p>;

  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <h3 className="font-bold mb-4 text-lg">Mis Publicaciones</h3>
      <div className="grid gap-4">
        {publicaciones.map((publicacion) => (
          <Details key={publicacion.id} publicacion={publicacion} />
        ))}
      </div>
    </div>
  );
};

export default Contain;
