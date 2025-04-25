"use client";
import React, { useEffect, useState, useContext } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import VehDetails from "./VehDetails";
import { VehUserIdContext } from "../../context/VehUserIdContext"; // Importa el contexto del usuario

const VehContain = () => {
  const { userId } = useContext(VehUserIdContext); // Obtiene el userId del usuario autenticado desde el contexto
  const [publicaciones, setPublicaciones] = useState([]); // Estado para almacenar las publicaciones
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    if (!userId) { 
      setLoading(false); // Si no hay userId, deja de cargar y evita hacer la consulta
      return;
    }

    // Función asíncrona para obtener las publicaciones del usuario autenticado
    const fetchUserPublications = async () => {
      try {
        // Consulta en Firebase Firestore para obtener las publicaciones del usuario filtrando por userId
        const q = query(collection(db, "Transportadores"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        // Mapea los documentos obtenidos y los guarda en el estado
        const publicacionesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPublicaciones(publicacionesData);
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        setError("Error al cargar las publicaciones. Por favor, intenta nuevamente.");
      } finally {
        setLoading(false); // Finaliza la carga, sea exitosa o con error
      }
    };

    fetchUserPublications();
  }, [userId]); // Se ejecuta cuando cambia el userId

  // Manejo de estados para mostrar mensajes apropiados
  if (loading) return <p className="text-gray-600">Cargando publicaciones...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (publicaciones.length === 0) return <p className="text-gray-600">No tienes publicaciones disponibles.</p>;

  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <h3 className="font-bold mb-4 text-lg">Mis Publicaciones</h3>
      <div className="grid gap-4">
        {/* Renderiza las publicaciones utilizando el componente Details */}
        {publicaciones.map((publicacion) => (
          <VehDetails key={publicacion.id} publicacion={publicacion} />
        ))}
      </div>
    </div>
  );
};

export default VehContain;