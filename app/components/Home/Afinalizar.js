import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Afinalizar = ({ solicitudId, enCamino, statusInicial, transportadorId, onUpdate }) => {
  const [status, setStatus] = useState(statusInicial);
  const router = useRouter();

  const handleFinalizar = async () => {
    try {
      await updateDoc(doc(db, "Solicitudes", solicitudId), {
        status: "finalizado",
      });
      setStatus("finalizado");
      if (onUpdate) onUpdate();

      if (transportadorId) {
        sessionStorage.setItem("vehUserId", transportadorId);
        router.push("/userPage");
      }
    } catch (error) {
      console.error("Error al finalizar servicio:", error);
    }
  };

  if (status === "finalizado") {
    return <p className="text-green-700 font-semibold mt-2">✅ Servicio finalizado</p>;
  }

  if (status === "confirmado" && enCamino === true) {
    return (
      <>
        <p className="text-blue-600 font-semibold mt-2">El transportador ya va en camino 🚚</p>
        <button
          onClick={handleFinalizar}
          className="mt-2 px-4 py-1 bg-blue-900 text-white rounded hover:bg-green-700 transition"
        >
          Finaliza acá cuando termine el servicio
        </button>
      </>
    );
  }

  return null;
};

export default Afinalizar;
