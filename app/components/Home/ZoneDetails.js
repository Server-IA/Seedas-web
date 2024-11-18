import React from 'react';

const ZoneDetails = ({ publicacion }) => {
  if (!publicacion) {
    return;
  }

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h3 className="text-xl font-semibold">Detalles del Trabajo</h3>
      <p><strong>Origen:</strong> {publicacion.source.name}</p>
      <p>
        <strong>Destino:</strong> {publicacion.destination.name}
      </p>
      <p>
        <strong>Vehículo:</strong> {publicacion.vehicle}
      </p>
      <p>
        <strong>Método de Pago:</strong> {publicacion.paymentMethod}
      </p>
      <p>
        <strong>Precio:</strong> ${parseFloat(publicacion.price).toLocaleString('es-CO')} COP
      </p>
      <p>
        <strong>Fecha:</strong> {publicacion.workingHours.date}
      </p>
      <p>
        <strong>Horario:</strong> {publicacion.workingHours.start} - {publicacion.workingHours.end}
      </p>
    </div>
  );
};

export default ZoneDetails;
