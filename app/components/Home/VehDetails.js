"use client";
import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import VehProductorCard from "./VehProductorCard";

const VehDetails = ({ publicacion }) => {
  const [productorAsignado, setProductorAsignado] = useState(null);

  useEffect(() => {
    if (!publicacion?.id) return;

    const q = query(
      collection(db, "Solicitudes"),
      where("publicationId", "==", publicacion.id),
      where("status", "==", "confirmado")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      if (data.length > 0) {
        setProductorAsignado(data[0]);
      } else {
        setProductorAsignado(null);
      }
    });

    return () => unsubscribe();
  }, [publicacion?.id]);

  const handleDelete = async () => {
    if (!publicacion?.id) return;

    try {
      await deleteDoc(doc(db, "Transportadores", publicacion.id));

      const solicitudesQuery = query(
        collection(db, "Solicitudes"),
        where("publicationId", "==", publicacion.id)
      );

      const solicitudesSnapshot = await getDocs(solicitudesQuery);
      const deletePromises = solicitudesSnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(db, "Solicitudes", docSnapshot.id))
      );

      await Promise.all(deletePromises);

      alert("Publicación y solicitudes eliminadas correctamente.");
    } catch (error) {
      console.error("Error eliminando publicación:", error);
      alert("Ocurrió un error al eliminar la publicación. Intenta nuevamente.");
    }
  };

  if (!publicacion) {
    return <p className="text-red-500">Error: No se pudo cargar la publicación.</p>;
  }

  return (
    <div className="p-4 border rounded-md shadow-md bg-white">
      <h3 className="text-xl font-semibold mb-4">Detalles de la Publicación</h3>

      <p><strong>Origen:</strong> {publicacion.source?.name || "No especificado"}</p>
      <p><strong>Destino:</strong> {publicacion.destination?.name || "No especificado"}</p>
      <p><strong>Teléfono:</strong> {publicacion.phone || "No especificado"}</p>
      <p><strong>Tipo de Vehículo:</strong> {publicacion.vehicle || "No especificado"}</p>
      <p><strong>Asientos Disponibles:</strong> {publicacion.seats || "No especificado"}</p>
      <p><strong>Método de Pago:</strong> {publicacion.paymentMethod || "No especificado"}</p>

      {/* Mostrar productor si hay solicitud confirmada */}
      {productorAsignado ? (
        <VehProductorCard productor={productorAsignado} />
      ) : (
        <p className="text-yellow-600 mt-4"><strong>Productor:</strong> No asignado</p>
      )}

      {/* Botón para eliminar */}
      <button
        onClick={() => {
          const confirmDelete = prompt(
            '⚠️ Para confirmar la eliminación de la publicación, escribe "eliminar"'
          );
          if (confirmDelete?.toLowerCase() === "eliminar") {
            handleDelete();
          } else {
            alert("Eliminación cancelada o texto incorrecto.");
          }
        }}
        className="mt-4 px-3 py-1 bg-[#800020] text-white text-sm rounded hover:bg-[#990022] transition"
      >
        Eliminar Publicación
      </button>
    </div>
  );
};

export default VehDetails;
