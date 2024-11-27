"use client";
import React from 'react';
import { useAuth } from '@clerk/nextjs'; // Para obtener el usuario autenticado
import { deletePublication } from '../../firebase/firebaseUtils'; // Asegúrate de importar la función deletePublication

const Details = ({ publicacion }) => {
  const { user } = useAuth(); // Obtener el usuario autenticado

  if (!publicacion) {
    return null;
  }

  // Función para eliminar la publicación
  const handleDelete = async () => {
    const confirm = window.confirm('¿Estás seguro de que deseas eliminar esta publicación?');
    if (confirm) {
      try {
        await deletePublication(publicacion.id); // Eliminar publicación de Firebase
        alert('Publicación eliminada correctamente');
      } catch (error) {
        alert('Error al eliminar la publicación');
        console.error('Error al eliminar la publicación:', error);
      }
    }
  };

  // Verificar si la publicación pertenece al usuario autenticado
  if (user?.id !== publicacion.userId) {
    return null; // No mostrar si la publicación no pertenece al usuario
  }

  return (
    <div className="p-4 border rounded-md shadow-md w-full">
      <h3 className="text-xl font-semibold">Detalles del Trabajo</h3>
      <p><strong>Origen:</strong> {publicacion.source.name}</p>
      <p><strong>Destino:</strong> {publicacion.destination.name}</p>
      <p><strong>Teléfono:</strong> {publicacion.phone}</p>
      <p><strong>Vehículo:</strong> {publicacion.vehicle}</p>
      <p><strong>Precio:</strong> ${parseFloat(publicacion.price).toLocaleString('es-CO')} COP</p>
      <p><strong>Fecha:</strong> {publicacion.workingHours.date}</p>
      <p><strong>Horario:</strong> {publicacion.workingHours.start} - {publicacion.workingHours.end}</p>
      <p><strong>Peso:</strong> {publicacion.weight} kg</p>
      <div className="mt-4 flex gap-2">
        {user && publicacion.userId === user.id && (
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-2 py-1.5 rounded-md ml-2"
          >
            Eliminar Publicación
          </button>
        )}
      </div>
    </div>
  );
};

export default Details;
