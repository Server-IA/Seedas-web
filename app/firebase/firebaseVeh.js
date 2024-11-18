import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const saveTransportadoresToFirestore = async (data) => {
  try {
    const docRef = doc(db, 'Transportadores', `${Date.now()}`);
    await setDoc(docRef, data);
    alert('Reserva guardada correctamente.');
  } catch (error) {
    console.error('Error al guardar la reserva:', error);
    alert('No se pudo guardar la reserva.');
  }
};
