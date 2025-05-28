'use client';
import { useEffect, useState } from 'react';
import { db } from "../../firebase/config";
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const VehProductorCard = ({ publicacionId }) => {
  const [productores, setProductores] = useState([]);

  useEffect(() => {
    const fetchProductores = async () => {
      try {
        // 1️⃣ Consulta las solicitudes relacionadas a la publicacionId
        const solicitudesRef = collection(db, 'Solicitudes');
        const q = query(solicitudesRef, where('publicacionId', '==', publicacionId));
        const querySnapshot = await getDocs(q);

        const productoresData = [];

        for (const docSolicitud of querySnapshot.docs) {
          const solicitudData = docSolicitud.data();

          // 2️⃣ Obtén la referencia al productor
          const productorId = solicitudData.productorId;
          if (productorId) {
            const productorDoc = await getDoc(doc(db, 'Productores', productorId));
            if (productorDoc.exists()) {
              const productorData = productorDoc.data();
              productoresData.push({
                id: productorDoc.id,
                nombre: productorData.nombre,
                numero: productorData.numero,
              });
            }
          }
        }

        setProductores(productoresData);
      } catch (error) {
        console.error('Error al obtener los productores:', error);
      }
    };

    fetchProductores();
  }, [publicacionId]);

  return (
    <div className="p-4 border rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">Productores registrados en esta publicación</h2>
      {productores.length > 0 ? (
        <ul>
          {productores.map((productor) => (
            <li key={productor.id} className="mb-2">
              <p><strong>Nombre:</strong> {productor.nombre}</p>
              <p><strong>Teléfono:</strong> {productor.numero}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay productores registrados aún.</p>
      )}
    </div>
  );
};

export default VehProductorCard;
