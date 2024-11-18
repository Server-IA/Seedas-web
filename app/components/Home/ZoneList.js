import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config'; // Asegúrate de que la configuración de Firebase esté en este archivo
import ZoneDetails from './ZoneDetailsVeh';

const ZoneContain = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Transportadores'));
        const publicacionesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPublicaciones(publicacionesData);
      } catch (error) {
        console.error('Error al obtener los datos de Firebase:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicaciones();
  }, []);

  if (loading) {
    return <p>Cargando datos...</p>;
  }



  return (
    <div className="grid gap-4">
      {publicaciones.map((publicacion) => (
        <ZoneDetailsVeh key={publicacion.id} publicacion={publicacion} />
      ))}
    </div>
  );
};

export default ZoneContain;
