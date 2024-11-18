'use client';  // Indica que este es un componente del lado del cliente

import React, { useState, useContext } from 'react';
import { db, collection, addDoc } from '../../firebase/config';
import VehInputItem from './VehInputItem';
import { VehSourceContext } from '../../context/VehSourceContext';
import { VehRadiusContext } from '../../context/VehRadiusContext';
import VehicleForm from './VehicleForm'; // Importa el formulario del vehículo

function VehSearchSection() {
  const { source } = useContext(VehSourceContext);
  const { radius, setRadius } = useContext(VehRadiusContext);
  const [vehicle, setVehicle] = useState('');
  const [workingHours, setWorkingHours] = useState({ start: '', end: '' });
  const [contact, setContact] = useState({ name: '', phone: '' });
  const [passengers, setPassengers] = useState(1);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!source.lat || !source.lng) {
      alert('Por favor selecciona una dirección.');
      return;
    }

    try {
      await addDoc(collection(db, 'vehicles'), {
        vehicle,
        workingHours,
        contact,
        passengers,
        radius,
        image,
        location: source,
      });
      alert('¡Datos enviados correctamente!');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      alert('Ocurrió un error al enviar los datos.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-200 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Completa tu información</h2>

      <VehicleForm
        vehicle={vehicle}
        setVehicle={setVehicle}
        workingHours={workingHours}
        setWorkingHours={setWorkingHours}
        contact={contact}
        setContact={setContact}
        passengers={passengers}
        setPassengers={setPassengers}
        image={image}
        setImage={setImage}
        radius={radius}
        setRadius={setRadius}
      />

      <button type="submit" className="bg-black text-white px-4 py-2 rounded">
        Enviar
      </button>
    </form>
  );
}

export default VehSearchSection;
