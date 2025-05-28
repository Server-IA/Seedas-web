"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useUser } from "@clerk/nextjs";
import ZonaDetails from "./ZonaDetails";

const ZonaList = () => {
  const { user } = useUser();
  const [misPublicaciones, setMisPublicaciones] = useState([]);

  useEffect(() => {
    if (!user) return;

    const obtenerMisSuscripciones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "VehComunitario"));
        const publicacionesFiltradas = [];

        const hoy = new Date();

        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          const fechaRuta = new Date(data.date.seconds * 1000);
          const fechaLimite = new Date(fechaRuta);
          fechaLimite.setDate(fechaRuta.getDate() + 1);

          const estaSuscrito = data.suscriptores?.some(
            (sub) => sub.userId === user.id
          );

          // Si está suscrito pero ya pasó la fecha límite, eliminar la suscripción
          if (estaSuscrito && fechaLimite < hoy) {
            const nuevosSuscriptores = data.suscriptores.filter(
              (sub) => sub.userId !== user.id
            );
            await updateDoc(doc(db, "VehComunitario", docSnap.id), {
              suscriptores: nuevosSuscriptores,
              usuariosDisponibles: (data.usuariosDisponibles || 0) + 1,
            });
            continue; // no mostrar esta publicación
          }

          // Mostrar solo si aún está suscrito y no ha pasado la fecha límite
          if (estaSuscrito) {
            publicacionesFiltradas.push({ id: docSnap.id, ...data });
          }
        }

        setMisPublicaciones(publicacionesFiltradas);
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
      }
    };

    obtenerMisSuscripciones();
  }, [user]);

  const handleDesuscribirse = async (id) => {
    try {
      const ref = doc(db, "VehComunitario", id);
      const publicacion = misPublicaciones.find((pub) => pub.id === id);

      const nuevosSuscriptores = publicacion.suscriptores.filter(
        (sub) => sub.userId !== user.id
      );

      await updateDoc(ref, {
        suscriptores: nuevosSuscriptores,
        usuariosDisponibles: publicacion.usuariosDisponibles + 1,
      });

      setMisPublicaciones((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al desuscribirse:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Mis publicaciones suscritas</h2>

      {misPublicaciones.length === 0 ? (
        <p>No estás suscrito a ninguna publicación.</p>
      ) : (
        <div className="max-h-[500px] overflow-y-auto space-y-4">
          {misPublicaciones.slice(0, 3).map((transporte) => (
            <ZonaDetails
              key={transporte.id}
              transporte={transporte}
              onDesuscribirse={() => handleDesuscribirse(transporte.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ZonaList;

