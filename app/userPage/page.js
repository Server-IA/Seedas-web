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

  const userId = user?.id;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const fetchTransportadorId = async () => {
      if (!user) return;

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
          console.log("TransportadorId encontrado:", solicitudData.transportadorId);
        } else {
          console.log("No hay solicitudes confirmadas para este productor.");
        }
      } catch (error) {
        console.error("Error buscando solicitud confirmada:", error);
      }
    };

    fetchTransportadorId();
  }, [user]);

  if (!hasMounted) {
    return null; // Evita el error de hidratación
  }

  return (
    <UserIdContext.Provider value={userId}>
      <VehUserIdContext.Provider value={vehUserId}>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-1">
            <UserInfo userId={userId} />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <div className="p-6 bg-white border rounded shadow-md w-full mt-0">
              <UserReviewForm userId={userId} />
            </div>
            <div className="mt-4 p-6 bg-white border rounded shadow-md w-full">
              <UserReviewsDisplay userId={userId} />
            </div>
          </div>
        </div>
      </VehUserIdContext.Provider>
    </UserIdContext.Provider>
  );
}
