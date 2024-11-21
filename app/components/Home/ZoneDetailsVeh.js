import React from 'react';

const ZoneDetailsVeh = ({ publicacion }) => {
  if (!publicacion) {
    return null;
  }

  // Construir mensaje para enviar
  const message = `
    Hola, estoy interesado en tu transporte:
    - Origen: ${publicacion.source.name}
    - Vehículo: ${publicacion.vehicle}
    - Radio de búsqueda: ${publicacion.radius} km
    - Asientos disponibles: ${publicacion.seats}
    - Fecha: ${publicacion.workingHours.date}
    - Horario: ${publicacion.workingHours.start} - ${publicacion.workingHours.end}
    - Teléfono: ${publicacion.phone}
  `;

  // Función para enviar a WhatsApp
  const handleSendWhatsApp = () => {
    const phone = publicacion.phone || ''; // Teléfono del transportador
    if (!phone) {
      alert('El número de teléfono no está disponible.');
      return;
    }
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Función para enviar por correo
  const handleSendEmail = () => {
    const email = publicacion.email || ''; // Correo del transportador
    if (!email) {
      alert('El correo electrónico no está disponible.');
      return;
    }
    const emailUrl = `mailto:${email}?subject=Interés en tu transporte&body=${encodeURIComponent(message)}`;
    window.open(emailUrl, '_blank');
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h3 className="text-xl font-semibold">Detalles del Transporte</h3>
      <p><strong>Origen:</strong> {publicacion.source.name}</p>
      <p><strong>Vehículo:</strong> {publicacion.vehicle}</p>
      <p><strong>Radio:</strong> {publicacion.radius} km</p>
      <p><strong>Teléfono:</strong> {publicacion.phone}</p>
      <p><strong>Asientos disponibles:</strong> {publicacion.seats}</p>
      <p><strong>Fecha:</strong> {publicacion.workingHours.date}</p>
      <p><strong>Horario:</strong> {publicacion.workingHours.start} - {publicacion.workingHours.end}</p>
      <div className="mt-4">
        <h4 className="text-lg font-semibold">Imágenes del Vehículo:</h4>
        <div className="grid grid-cols-3 gap-2">
          {publicacion.images && publicacion.images.length > 0 ? (
            publicacion.images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Imagen ${index + 1}`}
                className="w-full h-20 object-cover rounded"
              />
            ))
          ) : (
            <p>No hay imágenes disponibles.</p>
          )}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSendWhatsApp}
          className="bg-green-500 text-white px-2 py-1.5 rounded-md"
        >
          Enviar a WhatsApp
        </button>
        <button
          onClick={handleSendEmail}
          className="bg-blue-800 text-white px-2 py-1.5 rounded-md"
        >
          Enviar por Correo
        </button>
      </div>
    </div>
  );
};

export default ZoneDetailsVeh;
