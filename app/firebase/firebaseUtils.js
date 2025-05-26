import { 
  doc, 
  setDoc, 
  deleteDoc, 
  collection,  
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { db } from "./config"; 
// 📌 Función para generar un ID único basado en el usuario y el tiempo
const generateUniqueId = (userId) => `${userId}_${Date.now()}`;

// 🔹 Guardar una publicación en Firestore (varias publicaciones por usuario)
export const saveProductoresToFirestore = async (data) => {
  try {
    if (!data?.userId) throw new Error("El userId es nulo o indefinido");

    const uniqueId = generateUniqueId(data.userId); // ID único para múltiples publicaciones
    const docRef = doc(db, "Productores", uniqueId); // Colección general: Productores

    // Asegurarse de que no hay objetos anidados complejos
    const sanitizedData = JSON.parse(JSON.stringify(data));

    await setDoc(docRef, {
      ...sanitizedData,
      id: uniqueId,
      createdAt: new Date().toISOString(), // Timestamp ISO
    });

    console.log("📌 Publicación guardada correctamente.");
    return uniqueId;
  } catch (error) {
    console.error("❌ Error al guardar la publicación:", error);
    throw error;
  }
};

// 🔹 Obtener publicaciones de un usuario
export const getUserPublications = async (userId) => {
  try {
    if (!userId) throw new Error("El userId es nulo o indefinido");

    const q = query(collection(db, "Productores"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error al obtener publicaciones:", error);
    throw error;
  }
};

// 🔹 Eliminar una publicación
export const deletePublication = async (id) => {
  try {
    if (!id) throw new Error("El id de la publicación es nulo o indefinido");

    await deleteDoc(doc(db, "Productores", id));
    console.log("🗑️ Publicación eliminada correctamente.");
  } catch (error) {
    console.error("❌ Error al eliminar la publicación:", error);
    throw error;
  }
};

