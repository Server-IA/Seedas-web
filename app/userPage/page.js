"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { UserIdContext } from "../context/UserIdContext";
import { VehUserIdContext } from "../context/VehUserIdContext";
import UserInfo from "../components/Home/UserInfo";
import UserReviewForm from "../components/Home/UserReviewForm";
import UserReviewsDisplay from "../components/Home/UserReviewsDisplay";

export default function UserPage() {
  const { user } = useUser();
  const [vehUserId, setVehUserId] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [finalUserId, setFinalUserId] = useState(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const storedVehId = sessionStorage.getItem("vehUserId");

    if (storedVehId) {
      setVehUserId(storedVehId);
      setFinalUserId(storedVehId); // Si hay un transportador, usar ese
    } else if (user) {
      // Si no hay transportador pero el usuario está autenticado, buscar solicitudes
      const fetchTransportadorId = async () => {
        try {
          const q = query(
            collection(db, "Solicitudes"),
            where("productorId", "==", user.id),
            where("status", "==", "confirmado")
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const solicitudData = querySnapshot.docs[0].data();
            setVehUserId(solicitudData.transportadorId);
            setFinalUserId(solicitudData.transportadorId);
            sessionStorage.setItem("vehUserId", solicitudData.transportadorId);
            console.log("TransportadorId encontrado:", solicitudData.transportadorId);
          } else {
            console.log("No hay solicitudes confirmadas para este productor.");
            setFinalUserId(user.id); // En ese caso usar el user.id
          }
        } catch (error) {
          console.error("Error buscando solicitud confirmada:", error);
          setFinalUserId(user.id); // Fallback
        }
      };

      fetchTransportadorId();
    }
  }, [user]);

  if (!hasMounted || !user) {
    return <p className="text-gray-600 p-6">Cargando usuario...</p>;
  }

  return (
    <UserIdContext.Provider value={finalUserId}>
      <VehUserIdContext.Provider value={vehUserId}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-1">
            <UserInfo />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <div className="p-6 bg-white border rounded shadow-md w-full mt-0">
              <UserReviewForm />
            </div>
            <div className="mt-4 p-6 bg-white border rounded shadow-md w-full">
              <UserReviewsDisplay />
            </div>
          </div>
        </div>
      </VehUserIdContext.Provider>
    </UserIdContext.Provider>
  );
}
