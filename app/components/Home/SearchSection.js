"use client";
import React, { useContext, useEffect, useState } from "react";
import InputItem from "./InputItem";
import { SourceContext } from "../../context/SourceContext";
import { DestinationContext } from "../../context/DestinationContext";
import { UserIdContext } from "../../context/UserIdContext";
import { useRouter } from "next/navigation";
import { saveProductoresToFirestore } from "../../firebase/firebaseUtils";
import CarListOptions from "./CarListOptions";
import DateSelector from "./DateSelector";
import InputPhone from "./InputPhone";
import InputWeight from "./InputWeight";

const calculatePrice = (distance, weight, carRate) => {
  const baseRate = distance > 300 ? 2500 : 2000;
  const weightFactor = Math.ceil(weight / 200);
  return (carRate * distance * (baseRate / 1000) * weightFactor).toFixed(2);
};

function SearchSection() {
  const { source } = useContext(SourceContext);
  const { destination } = useContext(DestinationContext);
  const userId = useContext(UserIdContext); // Ahora userId se obtiene correctamente

  const [price, setPrice] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [workingHours, setWorkingHours] = useState({ date: "", start: "", end: "" });
  const [weight, setWeight] = useState(0);
  const [phone, setPhone] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (source && destination && selectedCar && weight > 0) {
      const R = 6371;
      const dLat = (destination.lat - source.lat) * (Math.PI / 180);
      const dLng = (destination.lng - source.lng) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(source.lat * (Math.PI / 180)) *
          Math.cos(destination.lat * (Math.PI / 180)) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = R * c;

      const calculatedPrice = calculatePrice(dist, weight, selectedCar.amount);
      setPrice(calculatedPrice);
    } else {
      setPrice(null);
    }
  }, [source, destination, selectedCar, weight]);

  const handlePayment = async (paymentMethod) => {
    if (!source || !destination || !selectedCar || !workingHours.date || weight <= 0 || !phone) {
      alert("Por favor, completa todos los campos antes de continuar.");
      return;
    }

    if (!userId) {
      alert("No se encontró el userId. Por favor, inicia sesión nuevamente.");
      return;
    }

    const ProductoresData = {
      userId,
      source,
      destination,
      vehicle: selectedCar.name,
      price,
      weight,
      workingHours,
      phone,
      paymentMethod,
    };

    try {
      await saveProductoresToFirestore(ProductoresData);
      alert("Publicación creada exitosamente.");
      router.push("/zonaTrabajo");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      alert("Hubo un error al guardar la información. Por favor, inténtalo nuevamente.");
    }
  };

  return (
    <div className="p-4 border rounded-xl">
      <InputItem type="source" />
      <InputItem type="destination" />
      <InputPhone phone={phone} setPhone={setPhone} />
      <InputWeight weight={weight} setWeight={setWeight} />
      <CarListOptions setSelectedCar={setSelectedCar} />
      <DateSelector setWorkingHours={setWorkingHours} />
      {price && (
        <div>
          <p>Precio estimado: ${price} pesos</p>
          <button onClick={() => handlePayment("online")} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Pagar en línea
          </button>
          <button onClick={() => handlePayment("cash")} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
            Pagar en efectivo
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchSection;
