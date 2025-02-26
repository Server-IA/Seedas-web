import { doc, setDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./config"; // Configuración de Firebase

// Guardar una publicación en Firestore
export const saveProductoresToFirestore = async (data) => {
  try {
    if (!data.userId) throw new Error("El userId es nulo o indefinido");

    const uniqueId = `${data.userId}_${Date.now()}`; // ID único basado en el usuario y el tiempo
    const docRef = doc(db, "Productores", uniqueId);
    await setDoc(docRef, { ...data, id: uniqueId, createdAt: new Date().toISOString() }); // Timestamp y ID único
    console.log("Publicación guardada correctamente.");
  } catch (error) {
    console.error("Error al guardar la publicación:", error);
    throw error;
  }
};

// Obtener publicaciones de un usuario
export const getUserPublications = async (userId) => {
  try {
    if (!userId) throw new Error("El userId es nulo o indefinido");

    const q = query(collection(db, "Productores"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener publicaciones:", error);
    throw error;
  }
};

// Eliminar una publicación en Firestore
export const deletePublication = async (id) => {
  try {
    if (!id) throw new Error("El id de la publicación es nulo o indefinido");

    await deleteDoc(doc(db, "Productores", id));
    console.log("Publicación eliminada correctamente.");
  } catch (error) {
    console.error("Error al eliminar la publicación:", error);
    throw error;
  }
};
