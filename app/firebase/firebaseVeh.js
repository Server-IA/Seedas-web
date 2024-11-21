// firebase/firebaseVeh.js

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from './config'; // Importamos la configuración y el almacenamiento

// Función para subir imagen a Firebase Storage
export const uploadImage = async (file) => {
  const storageRef = ref(storage, `images/${file.name}-${Date.now()}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progreso de la carga
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error('Error al subir la imagen:', error);
        reject('Error al subir la imagen. Intenta de nuevo.');
      },
      () => {
        // Al finalizar la carga, obtener la URL de la imagen
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL); // Devuelves la URL de la imagen
          })
          .catch((error) => {
            reject('Error al obtener la URL de la imagen.');
          });
      }
    );
  });
};

// Función para guardar datos del transportador en Firestore
export const saveTransportadoresToFirestore = async (data) => {
  try {
    const docRef = doc(db, 'Transportadores', `${Date.now()}`);
    await setDoc(docRef, data); // Guarda los datos en la colección 'Transportadores'
    console.log('Reserva guardada correctamente');
  } catch (error) {
    console.error('Error al guardar la reserva:', error);
    throw new Error('No se pudo guardar la reserva. Por favor, inténtalo nuevamente.');
  }
};
