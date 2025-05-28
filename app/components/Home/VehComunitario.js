"use client";

import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { VehSourceContext } from "../../context/VehSourceContext";
import { VehDestinationContext } from "../../context/VehDestinationContext";
import { saveVehComunitarioToFirestore } from "../../firebase/comunitario";
import VehInputSource from "./VehInputSource";
import VehInputDestination from "./VehInputDestination";
import VehDate from "./VehDate";
import VehicleForm from "./VehicleForm";
import VehImage from "./VehImage";

const calculateDistance = (source, destination) => {
  if (!source || !destination) return 0;

  const R = 6371; // km
  const dLat = (destination.lat - source.lat) * (Math.PI / 180);
  const dLng = (destination.lng - source.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(source.lat * (Math.PI / 180)) *
      Math.cos(destination.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const calculatePrice = (distance, tarifaBase) => {
  const baseRate = distance > 300 ? 2500 : 2000;
  return tarifaBase * distance * (baseRate / 1000);
};

function VehComunitario() {
  const router = useRouter();
  const { source } = useContext(VehSourceContext);
  const { destination } = useContext(VehDestinationContext);
  const [vehicle, setVehicle] = useState({ name: "", tarifaBase: 0 });
  const [phone, setPhone] = useState("");
  const [seats, setSeats] = useState("");
  const [images, setImages] = useState([]);
  const [date, setDate] = useState(null);
  const [price, setPrice] = useState(null);

  const { user } = useUser();
  const userId = user?.id;
  const userName = user?.fullName;
  const email = user?.primaryEmailAddress?.emailAddress || "";

  // Calcula el precio automáticamente cuando cambian origen, destino o vehículo
  useEffect(() => {
    if (source && destination && vehicle.tarifaBase) {
      const dist = calculateDistance(source, destination);
      const calculatedPrice = calculatePrice(dist, vehicle.tarifaBase);
      setPrice(calculatedPrice.toFixed(2));
    } else {
      setPrice(null);
    }
  }, [source, destination, vehicle]);

  const handleSubmit = async () => {
    if (!userId || !userName || !email) {
      alert("El usuario no está autenticado.");
      return;
    }

    if (!phone || !seats || !vehicle.name || !source || !destination || !date) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (!/^\d+$/.test(phone)) {
      alert("El teléfono solo debe contener números.");
      return;
    }

    if (!price) {
      alert("No se pudo calcular el precio.");
      return;
    }

    const data = {
      userId,
      userName,
      email,
      phone,
      vehicle: vehicle.name,
      tarifaBase: vehicle.tarifaBase,
      seats: parseInt(seats, 10),
      images,
      source,
      destination,
      date: date instanceof Date ? date : new Date(date),
      usuariosDisponibles: parseInt(seats, 10),
      price: parseFloat(price), // guardamos el precio calculado
    };

    try {
      await saveVehComunitarioToFirestore(data); // Guarda en "ehcomunitario"
      alert("¡Transporte comunitario publicado con éxito!");
      router.push("/zonaTrabajo");
    } catch (err) {
      console.error("Error al guardar en Firestore:", err);
      alert("Ocurrió un error al guardar. Revisa la consola.");
    }
  };

  return (
    <div>
      <p className="text-sm mb-4 text-black">
        🚗 Comparte tu vehículo con la comunidad y define origen, destino y fecha.
      </p>

      <VehInputSource />
      <VehInputDestination />
      <VehDate selectedDate={date} setSelectedDate={setDate} />

      <div className="mt-4">
        <p className="mb-2 font-semibold text-black">Teléfono:</p>
        <input
          type="text"
          value={phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setPhone(value);
          }}
          className="p-2 border rounded w-full"
          inputMode="numeric"
          pattern="\d*"
        />
      </div>

      <VehicleForm setVehicle={setVehicle} />

      <div className="mt-4">
        <p className="mb-2 font-semibold text-black">Asientos disponibles:</p>
        <input
          type="number"
          min="1"
          value={seats}
          onChange={(e) => setSeats(e.target.value.replace(/\D/g, ""))}
          className="p-2 border rounded w-full"
        />
      </div>

      <VehImage images={images} setImages={setImages} />

      {price && (
        <p className="mt-2 font-semibold text-green-700">
          Precio estimado: ${price} pesos
        </p>
      )}

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-900 text-white p-3 rounded w-full hover:bg-gray-800 transition-colors"
      >
        Publicar Transporte Comunitario
      </button>
    </div>
  );
}

export default VehComunitario;
