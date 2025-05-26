"use client";

import React, { useContext, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { addReview } from "../../firebase/reviews";
import { VehUserIdContext } from "../../context/VehUserIdContext";

const UserReviewForm = ({ onReviewSaved }) => {
  const { user } = useUser();
  const vehUserId = useContext(VehUserIdContext);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!user) return alert("Debes iniciar sesión");

    if (!vehUserId) {
      alert("No hay un transportador para asociar esta reseña.");
      return;
    }

    const reviewData = {
      transportadorId: vehUserId,             // El transportador que recibe la reseña
      reviewerId: user.id,                    // El usuario actual que deja la reseña
      reviewerName: user.fullName || "Anónimo",
      rating,
      comment,
    };

    console.log("🔎 Datos de la reseña:", reviewData);

    try {
      await addReview(reviewData);
      setRating(5);
      setComment("");
      if (onReviewSaved) onReviewSaved();
      alert("Reseña guardada correctamente.");
    } catch (err) {
      console.error("Error al guardar la reseña:", err);
      alert("Error al guardar la reseña. Intenta nuevamente.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6 border">
      <h3 className="text-lg font-semibold mb-2">Deja tu reseña</h3>

      <label className="block mb-2 text-sm font-medium">Puntuación:</label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="mb-3 w-full p-2 border rounded"
      >
        {[5, 4, 3, 2, 1].map((val) => (
          <option key={val} value={val}>{val} ⭐</option>
        ))}
      </select>

      <textarea
        className="w-full p-2 border rounded mb-3"
        placeholder="Escribe un comentario..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />

      <button
        onClick={handleSubmit}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
      >
        Enviar reseña
      </button>
    </div>
  );
};

export default UserReviewForm;
