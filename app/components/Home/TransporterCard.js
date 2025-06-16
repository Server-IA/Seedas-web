"use client";

import React from "react";
import { useRouter } from "next/navigation";

const TransporterCard = ({ transportador }) => {
  const router = useRouter();

  if (!transportador) return null;

  const handleGoToUserPage = () => {
    if (transportador.transportadorId) {
      sessionStorage.setItem("vehUserId", transportador.transportadorId);
      router.push("/userPage");
    }
  };

  return (
    <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-md shadow-sm">
      <h4 className="text-lg font-semibold text-green-800 mb-2">Transportador asignado</h4>
      <p>
        <strong>Nombre:</strong>{" "}
        <span
          className="text-blue-600 underline hover:text-blue-800 cursor-pointer"
          onClick={handleGoToUserPage}
        >
          {transportador.transportadorName}
        </span>
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


