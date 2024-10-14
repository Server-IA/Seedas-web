'use client';
import React, { useState } from 'react';

const VehicleForm = () => {
  const [vehicle, setVehicle] = useState('');
  const [workingHours, setWorkingHours] = useState({ start: '', end: '' });
  const [contact, setContact] = useState({ name: '', phone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías enviar la información de vehículo junto con la ubicación del conductor seleccionada
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-200 p-6 rounded-lg mt-3">
      <div>
        <label>Tipo de Vehículo</label>
        <input
          type="text"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          className="w-full p-2 mt-2 mb-4 rounded"
        />
      </div>
      <div>
        <label>Horas de Trabajo</label>
        <div className="flex gap-4 mt-2 mb-4">
          <input
            type="time"
            value={workingHours.start}
            onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })}
            className="w-full p-2 rounded"
          />
          <input
            type="time"
            value={workingHours.end}
            onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })}
            className="w-full p-2 rounded"
          />
        </div>
      </div>
      <div>
        <label>Nombre</label>
        <input
          type="text"
          value={contact.name}
          onChange={(e) => setContact({ ...contact, name: e.target.value })}
          className="w-full p-2 mt-2 mb-4 rounded"
        />
      </div>
      <div>
        <label>Teléfono</label>
        <input
          type="text"
          value={contact.phone}
          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          className="w-full p-2 mt-2 mb-4 rounded"
        />
      </div>
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">Enviar</button>
    </form>
  );
};

export default VehicleForm;

