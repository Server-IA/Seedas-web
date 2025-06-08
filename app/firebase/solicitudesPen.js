import { doc, setDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "./config";

// 🔹 Guardar solicitud en Firestore
export const saveSolicitudToFirestore = async (data) => {
  try {
    const solicitudId = `solicitud_${crypto.randomUUID()}`;
    const docRef = doc(db, "Solicitudes", solicitudId);

    await setDoc(docRef, {
      ...data,
      id: solicitudId,
      createdAt: new Date().toISOString(),
    });

    console.log("Solicitud guardada con ID:", solicitudId);
    return solicitudId;
  } catch (error) {
    console.error("🔥 Error al guardar la solicitud:", error.message, error.stack);
    throw new Error("No se pudo guardar la solicitud en Firestore.");
  }
};

// 🔹 Cancelar publicación (desde lógica de solicitudes si es necesario)
export const cancelarPublicacion = async (publicacion, productorId) => {
  try {
    const docRef = doc(db, "Productores", publicacion.id);

    // Ocultar la publicación
    await updateDoc(docRef, { visible: false });

    // Si hay un transportador asignado, notificarle
    if (publicacion.transportadorId) {
      const notiRef = collection(db, "Notificaciones");
      await addDoc(notiRef, {
        tipo: "cancelacion",
        mensaje: `El productor canceló la publicación "${publicacion.titulo}"`,
        transportadorId: publicacion.transportadorId,
        productorId: productorId,
        publicacionId: publicacion.id,
        timestamp: new Date(),
        leido: false,
      });
    }

    alert("Publicación cancelada correctamente.");
  } catch (error) {
    console.error("Error al cancelar publicación:", error);
    alert("No se pudo cancelar la publicación.");
  }
};


