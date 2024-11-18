'use client';  // Indica que este es un componente del lado del cliente

import React from 'react';

function VehicleForm({
  vehicle, setVehicle, workingHours, setWorkingHours, contact, setContact,
  passengers, setPassengers, image, setImage, radius, setRadius
}) {
  return (
    <>
      <div className="mb-4">
        <label>Vehículo</label>
        <input
          type="text"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          placeholder="Ingrese el tipo de vehículo"
          className="w-full p-2 mt-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label>Horario de trabajo</label>
        <input
          type="text"
          value={workingHours.start}
          onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })}
          placeholder="Hora de inicio"
          className="w-full p-2 mt-2 rounded"
        />
        <input
          type="text"
          value={workingHours.end}
          onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })}
          placeholder="Hora de fin"
          className="w-full p-2 mt-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label>Contacto</label>
        <input
          type="text"
          value={contact.name}
          onChange={(e) => setContact({ ...contact, name: e.target.value })}
          placeholder="Nombre de contacto"
          className="w-full p-2 mt-2 rounded"
        />
        <input
          type="text"
          value={contact.phone}
          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          placeholder="Teléfono"
          className="w-full p-2 mt-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label>Pasajeros</label>
        <input
          type="number"
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
          min="1"
          className="w-full p-2 mt-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label>Imagen</label>
        <input
          type="file"
          onChange={e => setImage(URL.createObjectURL(e.target.files[0]))}
          className="w-full p-2 mt-2 rounded"
        />
        {image && <img src={image} alt="Imagen del vehículo" className="mt-2" />}
      </div>

      <div className="mb-4">
        <label>Radio</label>
        <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          min="1"
          max="50"
          className="w-full p-2 mt-2 rounded"
        />
      </div>
    </>
  );
}

export default VehicleForm;
