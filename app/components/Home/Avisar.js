"use client";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useState } from "react";

const Avisar = ({ solicitudId, enCaminoInicial, status, onUpdate }) => {
  const [enCamino, setEnCamino] = useState(enCaminoInicial);

  const handleAvisar = async () => {
    try {
      await updateDoc(doc(db, "Solicitudes", solicitudId), {
        enCamino: true,
      });
      setEnCamino(true);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error al marcar como en camino:", error);
    }
  };

  if (status !== "confirmado") {
    return null; // No renderiza nada si no está confirmado
  }

  return enCamino ? (
    <p className="text-blue-600 font-semibold mt-2">Has avisado que vas en camino 🚚</p>
  ) : (
    <button
      onClick={handleAvisar}
      className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Avisar que ya voy de camino
    </button>
  );
};

export default Avisar;

