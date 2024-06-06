'use client';
import React, { useState } from 'react';

const VehicleForm = () => {
  // Estado para almacenar la información del formulario
  const [vehicle, setVehicle] = useState('');
  const [maxLoad, setMaxLoad] = useState('');
  const [workingHours, setWorkingHours] = useState({ start: '', end: '' });
  const [contact, setContact] = useState({ name: '', phone: '' });
  const [dates, setDates] = useState({ startDate: '', endDate: '' });
  const [vehicleImage, setVehicleImage] = useState(null);

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí manejarías la lógica para enviar los datos del formulario
  };

  // Función para manejar la carga de la imagen del vehículo
  const handleImageUpload = (e) => {
    setVehicleImage(e.target.files[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-200 p-6 rounded-lg mt-3">
      {/* Campo para el tipo de vehículo */}
      <div>
        <label>Tipo de Vehículo (ej. Camión, Furgoneta, etc.)</label>
        <input
          type="text"
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          className="w-full p-2 mt-2 mb-4 rounded"
          placeholder="Tipo de vehículo"
        />
      </div>

      {/* Campo para la carga máxima */}
      <div>
        <label>Máximo Peso a Cargar (kg)</label>
        <input
          type="number"
          value={maxLoad}
          onChange={(e) => setMaxLoad(e.target.value)}
          className="w-full p-2 mt-2 mb-4 rounded"
          placeholder="Peso máximo en kg"
        />
      </div>

      {/* Campo para cargar la imagen del vehículo */}
      <div>
        <label>Foto del Vehículo</label>
        <input
          type="file"
          onChange={handleImageUpload}
          className="w-full p-2 mt-2 mb-4 rounded"
        />
      </div>

      {/* Campos para las horas de trabajo */}
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

      {/* Campos para las fechas de inicio y caducidad */}
      <div>
        <label>Fecha de Entrada</label>
        <input
          type="date"
          value={dates.startDate}
          onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
          className="w-full p-2 mt-2 mb-4 rounded"
        />
      </div>
      <div>
        <label>Fecha de Caducidad</label>
        <input
          type="date"
          value={dates.endDate}
          onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
          className="w-full p-2 mt-2 mb-4 rounded"
        />
      </div>

      {/* Campos para el nombre y teléfono de contacto */}
      <div>
        <label>Nombre</label>
        <input
          type="text"
          value={contact.name}
          onChange={(e) => setContact({ ...contact, name: e.target.value })}
          className="w-full p-2 mt-2 mb-4 rounded"
          placeholder="Nombre del contacto"
        />
      </div>
      <div>
        <label>Teléfono</label>
        <input
          type="text"
          value={contact.phone}
          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          className="w-full p-2 mt-2 mb-4 rounded"
          placeholder="Número de teléfono"
        />
      </div>

      {/* Botón para enviar el formulario */}
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">Enviar</button>
    </form>
  );
};

export default VehicleForm;
