// firebase/Comunitario.js
import { db } from "./config";
import { collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";

// 📍 Guardar la publicación inicial de transporte comunitario
export const saveVehComunitarioToFirestore = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "VehComunitario"), {
      ...data,
      suscriptores: [],
      createdAt: new Date(),
    });
    console.log("Publicación de transporte comunitario creada con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar en vehcomunitario:", error);
    throw error;
  }
};

// 📍 Suscribir a un usuario a un transporte comunitario
export const subscribeToVehComunitario = async (vehComunitarioId, usuario) => {
  try {
    const docRef = doc(db, "VehComunitario", vehComunitarioId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("No existe la publicación de transporte comunitario.");
    }

    const data = docSnap.data();

    // Verificar la cantidad de sillas disponibles
    if (data.suscriptores.length >= data.seats) {
      throw new Error("No hay asientos disponibles para este transporte.");
    }

    // Verificar que el usuario no esté ya suscrito
    if (data.suscriptores.some((s) => s.userId === usuario.userId)) {
      throw new Error("Ya estás suscrito a esta publicación.");
    }

    const updatedSuscriptores = [...data.suscriptores, usuario];

    await updateDoc(docRef, {
      suscriptores: updatedSuscriptores,
    });

    console.log(`Usuario ${usuario.userName} suscrito correctamente a la publicación ${vehComunitarioId}`);
  } catch (error) {
    console.error("Error al suscribirse al transporte comunitario:", error);
    throw error;
  }
};
