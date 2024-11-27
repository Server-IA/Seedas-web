import { doc, setDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config'; // Asegúrate de que la configuración esté correctamente importada

// Guardar una reserva en Firestore
export const saveProductoresToFirestore = async (data) => {
  try {
    const uniqueId = `${data.userId}_${Date.now()}`; // ID único basado en el usuario y el tiempo
    const docRef = doc(db, 'Productores', uniqueId);
    await setDoc(docRef, { ...data, createdAt: new Date().toISOString() }); // Agrega un timestamp
    alert('Reserva guardada correctamente.');
  } catch (error) {
    console.error('Error al guardar la reserva:', error);
    alert('No se pudo guardar la reserva.');
  }
};

// Eliminar una publicación en Firestore
export const deletePublication = async (id) => {
  try {
    await deleteDoc(doc(db, 'Productores', id));
    alert('Publicación eliminada correctamente.');
  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    alert('No se pudo eliminar la publicación.');
  }
};

// Obtener publicaciones de un usuario
export const getUserPublications = async (userId) => {
  try {
    const q = query(collection(db, 'Productores'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    throw error;
  }
};
