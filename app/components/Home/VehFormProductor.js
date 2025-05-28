"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { VehSourceContext } from "../../context/VehSourceContext";
import { saveTransportadoresToFirestore } from "../../firebase/firebaseVeh";
import VehInputSource from "./VehInputSource";
import VehicleForm from "./VehicleForm";
import VehImage from "./VehImage";

function VehFormProductor() {
  const router = useRouter();
  const { source } = useContext(VehSourceContext);
  const [vehicle, setVehicle] = useState({ name: "", tarifaBase: 0 });
  const [phone, setPhone] = useState("");
  const [seats, setSeats] = useState("");
  const [images, setImages] = useState([]);

  const { user } = useUser();
  const userId = user?.id;
  const userName = user?.fullName;
  const email = user?.primaryEmailAddress?.emailAddress || "";

  const handleSubmit = async () => {
    if (!phone || !seats || !vehicle.name || !source) {
      alert("Por favor, completa todos los campos.");
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
    };

    try {
      await saveTransportadoresToFirestore(data);
      alert("¡Transporte para productor publicado con éxito!");
      router.push("/zonaTrabajo");
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Ocurrió un error. Intenta nuevamente.");
    }
  };

  return (
    <div>
      <p className="text-sm mb-4 text-black">
        🌾 Ofrece transporte a productores en tu zona.
      </p>

      <VehInputSource />

      <div className="mt-4">
        <p className="mb-2 font-semibold text-black">Teléfono:</p>
        <input
          type="number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <VehicleForm setVehicle={setVehicle} />

      <div className="mt-4">
        <p className="mb-2 font-semibold text-black">Asientos disponibles:</p>
        <input
          type="number"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      <VehImage images={images} setImages={setImages} />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-900 text-white p-3 rounded w-full hover:bg-gray-800 transition-colors"
      >
        Publicar Transporte para Productor
      </button>
    </div>
  );
}

export default VehFormProductor;
