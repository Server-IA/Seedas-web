"use client";

import React, { useContext, useEffect, useState } from "react";
import { SourceContext } from "../../context/SourceContext";
import { DestinationContext } from "../../context/DestinationContext";
import { UserIdContext } from "../../context/UserIdContext";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { saveProductoresToFirestore } from "../../firebase/firebaseUtils";
import { saveSolicitudToFirestore } from "../../firebase/solicitudesPen";

import CarListOption from "./CarListOption";
import InputSource from "./InputSource";
import InputDestination from "./InputDestination";
import InputPhone from "./InputPhone";
import InputWeight from "./InputWeight";
import Merchandise from "./Merchandise";
import DateSelector from "./DateSelector";

const calculatePrice = (distance, weight, tarifaBase) => {
  const baseRate = distance > 300 ? 2500 : 2000;
  const weightFactor = Math.ceil(weight / 200);
  return tarifaBase * distance * (baseRate / 1000) * weightFactor;
};

function SearchSection() {
  const { source } = useContext(SourceContext);
  const { destination } = useContext(DestinationContext);
  const { userId } = useContext(UserIdContext);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [price, setPrice] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [workingHours, setWorkingHours] = useState({ date: "", start: "", end: "" });
  const [weight, setWeight] = useState(""); // Cambiado a string
  const [phone, setPhone] = useState("");
  const [merchandiseData, setMerchandiseData] = useState({ type: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const parsedWeight = parseFloat(weight);
    if (source && destination && selectedCar && !isNaN(parsedWeight) && parsedWeight > 0) {
      const R = 6371;
      const dLat = (destination.lat - source.lat) * (Math.PI / 180);
      const dLng = (destination.lng - source.lng) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(source.lat * (Math.PI / 180)) *
          Math.cos(destination.lat * (Math.PI / 180)) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      const calculatedPrice = calculatePrice(distance, parsedWeight, selectedCar.tarifaBase);
      setPrice(calculatedPrice.toFixed(2));
    } else {
      setPrice(null);
    }
  }, [source, destination, selectedCar, weight]);

  const validateForm = () => {
    const errors = [];
    if (!source) errors.push("origen");
    if (!destination) errors.push("destino");
    if (!selectedCar) errors.push("vehículo");
    if (!workingHours.date) errors.push("fecha");
    if (!weight || parseFloat(weight) <= 0) errors.push("peso");
    if (!phone) errors.push("teléfono");

    if (errors.length > 0) {
      alert(`Por favor complete: ${errors.join(", ")}`);
      return false;
    }

    if (!userId || !isLoaded || !user) {
      alert("Debe iniciar sesión para continuar");
      return false;
    }

    return true;
  };

  const getUserDisplayName = (user) => {
    if (!user) return "Usuario";
    return (
      user.fullName ||
      user.username ||
      user.primaryEmailAddress?.emailAddress ||
      "Usuario"
    );
  };

  const handlePayment = async (paymentMethod) => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const userName = getUserDisplayName(user);
      const email = user?.primaryEmailAddress?.emailAddress || "";

      const publicationId = await saveProductoresToFirestore({
        userId,
        userName,
        email,
        source,
        destination,
        vehicle: selectedCar.vehicle,
        price,
        weight: parseFloat(weight),
        workingHours,
        phone,
        paymentMethod,
        merchandise: merchandiseData,
        status: "pendiente",
        visible: true,
        enCamino: false
      });

      await saveSolicitudToFirestore({
        productorId: userId,
        productorName: userName,
        productorEmail: email,
        transportadorId: selectedCar.userId,
        transportadorName: selectedCar.userName || "Transportador",
        publicationId,
        source,
        destination,
        price,
        weight: parseFloat(weight),
        vehicle: selectedCar.vehicle,
        workingHours,
        paymentMethod,
        merchandise: merchandiseData,
        status: "pendiente",
        visible: true,
        enCamino: false
      });

      if (paymentMethod === "cash") {
        alert("Ya se le envió la solicitud al transportador. Estate pendiente que acepte.");
         window.location.reload();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Hubo un error al guardar los datos. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl">
      <InputSource type="source" />
      <InputDestination type="destination" />
      <InputPhone phone={phone} setPhone={setPhone} />
      <Merchandise setMerchandiseData={setMerchandiseData} />
      <InputWeight weight={weight} setWeight={setWeight} />
      <DateSelector setWorkingHours={setWorkingHours} />
      <CarListOption setSelectedCar={setSelectedCar} />

      {price && (
        <div className="mt-4">
          <p className="text-lg font-bold">Precio estimado: ${price} pesos</p>
          <button
            onClick={() => handlePayment("online")}
            disabled={isSubmitting}
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg m-2 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Procesando..." : "Pagar en línea"}
          </button>
          <button
            onClick={() => handlePayment("cash")}
            disabled={isSubmitting}
            className={`bg-gray-600 text-white px-4 py-2 rounded-lg m-2 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Procesando..." : "Pagar en efectivo"}
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchSection;
