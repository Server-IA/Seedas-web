import React from 'react';
import { deletePublicationFromFirestore } from '../../firebase/firebaseUtils';

function Details({ data }) {
  const handleDelete = async () => {
    try {
      await deletePublicationFromFirestore(data.id);
      alert('Publicación eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar la publicación:', error);
      alert('Hubo un error al eliminar la publicación.');
    }
  };

  return (
    <div className="p-4 border rounded-md mb-4">
      <p><strong>Ubicación de origen:</strong> {data.source.name}</p>
      <p><strong>Ubicación de destino:</strong> {data.destination.name}</p>
      <p><strong>Vehículo:</strong> {data.vehicle}</p>
      <p><strong>Peso:</strong> {data.weight} kg</p>
      <p><strong>Precio:</strong> ${data.price} pesos</p>
      <p><strong>Tipo de carga:</strong> {data.merchandise.type}</p>
      {data.merchandise.type === 'otros' && (
        <p><strong>Descripción:</strong> {data.merchandise.description}</p>
      )}
      <button
        onClick={handleDelete}
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
      >
        Eliminar
      </button>
    </div>
  );
}

export default Details;
