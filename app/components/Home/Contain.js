import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config'; // Configuración de Firebase
import Details from './Details';
import { useAuth } from '@clerk/nextjs'; // Para obtener el correo del usuario autenticado

const Contain = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Obtener usuario autenticado

  // Asegurar que el correo está disponible
  const email = user?.primaryEmailAddress?.emailAddress || ''; 

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Productores'));
        const publicacionesData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((pub) => pub.email === email); // Filtrar publicaciones del usuario
        setPublicaciones(publicacionesData);
      } catch (error) {
        console.error('Error al obtener los datos de Firebase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, [email]);

  // Función para eliminar una publicación
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar esta publicación?'
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'Productores', id));
      setPublicaciones((prev) => prev.filter((pub) => pub.id !== id)); // Actualizar el estado local
      alert('Publicación eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
      alert('Hubo un error al eliminar la publicación. Inténtalo de nuevo.');
    }
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="p-4 bg-white border rounded shadow-md max-h-[400px] overflow-y-auto">
      <h3 className="text-lg font-bold mb-4">Tus Publicaciones</h3>
      {publicaciones.length === 0 ? (
        <p>No tienes publicaciones disponibles.</p>
      ) : (
        publicaciones.map((publicacion) => (
          <div key={publicacion.id} className="mb-4 border p-2 rounded">
            <Details publicacion={publicacion} />
            <button
              onClick={() => handleDelete(publicacion.id)}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Contain;
