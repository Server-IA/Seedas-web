"use client";

import React from "react";
import Link from "next/link";

const TransporterCard = ({ transportador }) => {
  if (!transportador) return null;

  return (
    <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md shadow-sm">
      <h4 className="text-lg font-semibold text-green-800 mb-2">Transportador asignado</h4>
      <p>
        <strong>Nombre:</strong>{" "}
        <Link href={`/perfil/${transportador.transportadorId}`}>
          <span className="text-blue-600 underline hover:text-blue-800">
            {transportador.transportadorName}
          </span>
        </Link>
      </p>
      {transportador.telefono && (
        <p><strong>Teléfono:</strong> {transportador.telefono}</p>
      )}
      {transportador.vehicle && (
        <p><strong>Vehículo:</strong> {transportador.vehicle}</p>
      )}
    </div>
  );
};

export default TransporterCard;

