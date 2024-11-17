import React, { useState } from 'react';
import { CarListData } from '../../../utils/CarListData';

const VehicleForm = () => {
  const [vehicle, setVehicle] = useState('');
  const [workingHours, setWorkingHours] = useState({ start: '', end: '' });
  const [contact, setContact] = useState({ name: '', phone: '' });
  const [image, setImage] = useState(null); // Estado para almacenar la imagen

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar la información de vehículo junto con la ubicación del conductor seleccionada y la imagen
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Aquí puedes agregar lógica para verificar que el archivo sea una imagen si lo deseas
      setImage(URL.createObjectURL(file)); // Esto creará una URL local para mostrar la imagen cargada
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-200 p-6 rounded-lg mt-3">
      <div>
        <label>Tipo de Vehículo</label>
        <select
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          className="w-full p-2 mt-2 mb-4 rounded"
        >
          {CarListData.slice(0, 3).map((car) => (
            <option key={car.id} value={car.name}>
              {car.name}
            </option>
          ))}
        </select>
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
      <div>
        <label>Imagen del Vehículo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 mt-2 mb-4 rounded"
        />
        {image && (
          <div className="mt-4">
            <img src={image} alt="Vista previa" className="w-32 h-32 object-cover rounded" />
          </div>
        )}
      </div>
      <button type="submit" className="bg-black text-white px-4 py-2 rounded">Enviar</button>
    </form>
  );
};

export default VehicleForm;
