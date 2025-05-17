"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import TransporterCard from "./TransporterCard";

const Details = ({ publicacion }) => {
  const [transportadorAsignado, setTransportadorAsignado] = useState(null);

  useEffect(() => {
    if (!publicacion?.id) return;

    const q = query(
      collection(db, "Solicitudes"),
      where("publicationId", "==", publicacion.id),
      where("status", "==", "confirmado") // O usa "aceptada" según tu estructura real
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      if (data.length > 0) {
        setTransportadorAsignado(data[0]); // Solo una solicitud confirmada por publicación
      } else {
        setTransportadorAsignado(null);
      }
    });

    return () => unsubscribe();
  }, [publicacion?.id]);

  if (!publicacion) {
    console.log("No se recibió ninguna publicación.");
    return <p className="text-red-500">Error: No se pudo cargar la publicación.</p>;
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
      <p>
        <strong>Horario:</strong>{" "}
        {publicacion.workingHours?.start || "?"} - {publicacion.workingHours?.end || "?"}
      </p>
      {publicacion.vehicle && <p><strong>Vehículo:</strong> {publicacion.vehicle}</p>}
      {publicacion.phone && <p><strong>Teléfono:</strong> {publicacion.phone}</p>}
      {publicacion.paymentMethod && <p><strong>Método de pago:</strong> {publicacion.paymentMethod}</p>}

      {/* Mostrar Transportador si hay solicitud confirmada */}
      {transportadorAsignado ? (
        <TransporterCard transportador={transportadorAsignado} />
      ) : (
        <p className="text-yellow-600 mt-4"><strong>Transportador:</strong> No asignado</p>
      )}
    </div>
  );
};

export default Details;
