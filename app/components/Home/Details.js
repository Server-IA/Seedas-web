"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import TransporterCard from "./TransporterCard";

const Details = ({ publicacion }) => {
  const [transportadorAsignado, setTransportadorAsignado] = useState(null);

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
        setTransportadorAsignado(data[0]);
      } else {
        setTransportadorAsignado(null);
      }
    });

    return () => unsubscribe();
  }, [publicacion?.id]);

  // ✅ Función corregida para cancelar publicación
  const handleCancel = async () => {
    if (!publicacion?.id) return;

    try {
      const mensaje = {
        texto: "El productor canceló la publicación.",
        timestamp: new Date().toISOString(),
      };

      // ✅ Buscar y actualizar todas las solicitudes con el mismo publicationId
      const solicitudesQuery = query(
        collection(db, "Solicitudes"),
        where("publicationId", "==", publicacion.id)
      );

      const solicitudesSnapshot = await getDocs(solicitudesQuery);

      const updatePromises = solicitudesSnapshot.docs.map((docSnap) =>
        updateDoc(doc(db, "Solicitudes", docSnap.id), {
          status: "cancelado",
          mensajeParaTransportador: mensaje,
        })
      );

      await Promise.all(updatePromises);

      alert("✅ Publicación cancelada correctamente.");
    } catch (error) {
      console.error("Error cancelando publicación:", error);
      alert("❌ Error al cancelar la publicación. Intenta nuevamente.");
    }
  };

  if (!publicacion) {
    return (
      <p className="text-red-500">
        Error: No se pudo cargar la publicación.
      </p>
    );
  }

  return (
    <div className="p-4 border rounded-md shadow-md bg-white">
      <h3 className="text-xl font-semibold mb-4">Detalles de la Publicación</h3>

      <p><strong>Origen:</strong> {publicacion.source?.name || "No especificado"}</p>
      <p><strong>Destino:</strong> {publicacion.destination?.name || "No especificado"}</p>
      <p>
        <strong>Precio:</strong>{" "}
        {publicacion.price
          ? `$${parseFloat(publicacion.price).toLocaleString("es-CO")} COP`
          : "No especificado"}
      </p>
      <p><strong>Peso:</strong> {publicacion.weight || "No especificado"} kg</p>
      <p><strong>Tipo de Mercancía:</strong> {publicacion.merchandise?.type || "No especificado"}</p>
      {publicacion.merchandise?.type === "otros" && (
        <p><strong>Descripción:</strong> {publicacion.merchandise?.description || "No especificado"}</p>
      )}
      <p><strong>Fecha:</strong> {publicacion.workingHours?.date || "No especificado"}</p>

      {publicacion.vehicle && <p><strong>Vehículo:</strong> {publicacion.vehicle}</p>}
      {publicacion.phone && <p><strong>Teléfono:</strong> {publicacion.phone}</p>}
      {publicacion.paymentMethod && <p><strong>Método de pago:</strong> {publicacion.paymentMethod}</p>}

      {transportadorAsignado ? (
        <TransporterCard transportador={transportadorAsignado} />
      ) : (
        <p className="text-yellow-600 mt-4">
          <strong>Transportador:</strong> No asignado
        </p>
      )}

      {/* Botón para cancelar publicación */}
      <button
        onClick={() => {
          const confirmCancel = prompt(
            '⚠️ Para confirmar la cancelación, escribe "cancelar"'
          );
          if (confirmCancel?.toLowerCase() === "cancelar") {
            handleCancel();
          } else {
            alert("Cancelación abortada o texto incorrecto.");
          }
        }}
        className="mt-4 px-3 py-1 bg-red-900 text-white text-sm rounded hover:bg-orange-700 transition"
      >
        Cancelar Publicación
      </button>
    </div>
  );
};

export default Details;
