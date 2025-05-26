import { db } from "./config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

// 👉🏼 Agrega una reseña
export const addReview = async (reviewData) => {
  try {
    const docRef = await addDoc(collection(db, "reviews"), reviewData);
    console.log("Reseña guardada con ID:", docRef.id);
    return docRef.id;
  } catch (err) {
    console.error("Error al guardar la reseña:", err);
    throw err;
  }
};

// 👉🏼 Obtiene reseñas por userId (transportadorId)
export const getReviewsByUserId = async (userId) => {
  try {
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("transportadorId", "==", userId)
    );
    const reviewsSnap = await getDocs(reviewsQuery);

    const reviews = [];
    reviewsSnap.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });

    return reviews;
  } catch (err) {
    console.error("Error al obtener las reseñas:", err);
    throw err;
  }
};
