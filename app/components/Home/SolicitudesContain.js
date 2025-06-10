// components/SoliContain.js
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Button } from './ui/button';

const SolicitudesContain = ({ solicitudId }) => {
  const [solicitud, setSolicitud] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'Solicitudes', solicitudId), (docSnap) => {
      if (docSnap.exists()) {
        setSolicitud({ id: docSnap.id, ...docSnap.data() });
      }
    });
    return () => unsub();
  }, [solicitudId]);

  const finalizarSolicitud = async () => {
    if (!solicitud) return;
    await updateDoc(doc(db, 'Solicitudes', solicitud.id), {
      status: 'finalizado',
      enCamino: false,
    });
  };

  if (!solicitud) return null;

  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow-md mt-2">
      <h3 className="text-lg font-semibold">📦 Detalles de la Solicitud</h3>
      <p><strong>Origen:</strong> {solicitud.origen}</p>
      <p><strong>Destino:</strong> {solicitud.destino}</p>
      <p><strong>Transportador:</strong> {solicitud.transportadorNombre || 'N/A'}</p>
      <p><strong>Estado:</strong> {solicitud.status}</p>

      {solicitud.enCamino && (
        <>
          <p className="text-blue-700 mt-2">🚚 El transportador ya va en camino.</p>
          <Button onClick={finalizarSolicitud} className="mt-2 bg-green-600 hover:bg-green-700 text-white">
            Finalizar Solicitud
          </Button>
        </>
      )}
    </div>
  );
};

export default SolicitudesContain;
