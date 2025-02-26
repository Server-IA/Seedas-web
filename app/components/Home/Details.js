"use client";
import React from "react";

const Details = ({ publicacion }) => {
  if (!publicacion) {
    console.log("No se recibió ninguna publicación.");
    return <p className="text-red-500">Error: No se pudo cargar la publicación.</p>;
  }

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h3 className="text-xl font-semibold mb-4">Detalles de la Publicación</h3>
      <p><strong>Título:</strong> {publicacion.title || "Sin título"}</p>
      <p><strong>Origen:</strong> {publicacion.source?.name || "No especificado"}</p>
      <p><strong>Destino:</strong> {publicacion.destination?.name || "No especificado"}</p>
      <p><strong>Precio:</strong> ${publicacion.price?.toLocaleString("es-CO") || "No especificado"} COP</p>
      <p><strong>Peso:</strong> {publicacion.weight || "No especificado"} kg</p>
      <p><strong>Fecha:</strong> {publicacion.workingHours?.date || "No especificado"}</p>
      <p><strong>Horario:</strong> {publicacion.workingHours?.start} - {publicacion.workingHours?.end}</p>
      {publicacion.vehicle && <p><strong>Vehículo:</strong> {publicacion.vehicle}</p>}
      {publicacion.phone && <p><strong>Teléfono:</strong> {publicacion.phone}</p>}
      {publicacion.paymentMethod && <p><strong>Método de pago:</strong> {publicacion.paymentMethod}</p>}
    </div>
  );
};

export default Details;
