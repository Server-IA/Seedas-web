"use client";

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { saveTransportadoresToFirestore } from '../../firebase/firebaseVeh';
import VehInputSource from './VehInputSource';
import VehInputDestination from './VehInputDestination';
import { VehSourceContext } from '../../context/VehSourceContext';
import { VehDestinationContext } from '../../context/VehDestinationContext';
import VehicleForm from './VehicleForm';
import VehImage from './VehImage';
import { useUser } from '@clerk/nextjs';

function VehSearchSection() {
  const router = useRouter();
  const { source } = useContext(VehSourceContext);
  const { destination } = useContext(VehDestinationContext);
  const [vehicle, setVehicle] = useState({ name: '', tarifaBase: 0 });
  const [phone, setPhone] = useState('');
  const [seats, setSeats] = useState('');
  const [images, setImages] = useState([]);
  const { user } = useUser();

  const userId = user?.id;
  const userName = user?.fullName;
  const email = user?.primaryEmailAddress?.emailAddress || ''; // 👈 Se añadió para guardar el correo

  const handleSubmit = async () => {
    if (!source || !destination || !vehicle || !phone || !seats || !images || !userId || !userName) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const TransportadoresData = {
      userId,
      userName,
      email, // 👈 AÑADIDO para guardar en la colección
      source,
      destination,
      phone,
      vehicle: vehicle.name,
      tarifaBase: vehicle.tarifaBase,
      seats: parseInt(seats, 10),
      images,
    };

    try {
      await saveTransportadoresToFirestore(TransportadoresData);
      alert('¡Publicación creada exitosamente!');
      router.push('/zonaTrabajo');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      alert('Hubo un problema al guardar los datos. Por favor, inténtalo nuevamente.');
    }
  };

  return (
    <div>
      <div className="p-4 border rounded-lg mb-8">
        <h2 className="text-lg font-bold">Crear publicación de transporte</h2>
        <VehInputSource type="source" />
        <VehInputDestination type="destination" />
        
        <div>
          <label className="block mb-2 font-semibold">Teléfono:</label>
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="Ingresa tu número de teléfono"
          />
        </div>

        <VehicleForm setVehicle={setVehicle} />

        <div className="mt-4">
          <label className="block mb-2 font-semibold">Vehículo seleccionado:</label>
          <input
            type="text"
            value={vehicle.name}
            readOnly
            className="p-2 border rounded w-full bg-gray-200"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-2 font-semibold">Asientos disponibles:</label>
          <input
            type="number"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="Ingresa el número de asientos disponibles"
          />
        </div>
        <VehImage images={images} setImages={setImages} />

        <button onClick={handleSubmit} className="mt-3 bg-gray-900 text-white p-3 rounded">
          Publicar
        </button>
      </div>
    </div>
  );
}

export default VehSearchSection;

