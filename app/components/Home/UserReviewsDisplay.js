"use client";

import React, { useContext, useEffect, useState } from "react";
import { getReviewsByUserId } from "../../firebase/reviews";
import { UserIdContext } from "../../context/UserIdContext";
import { VehUserIdContext } from "../../context/VehUserIdContext";

const UserReviewsDisplay = () => {
  const userId = useContext(UserIdContext);
  const vehUserId = useContext(VehUserIdContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    if (!vehUserId && !userId) return;

    try {
      const data = await getReviewsByUserId(vehUserId || userId);
      setReviews(data);
    } catch (error) {
      console.error("Error cargando reseñas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [vehUserId, userId]);

  if (loading) {
    return <p className="text-gray-500">Cargando reseñas...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border mt-6">
      <h3 className="text-lg font-semibold mb-3">Reseñas de otros usuarios</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No hay reseñas aún.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review, idx) => (
            <li key={idx} className="border-b pb-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{review.reviewerName}</span>
                <span className="text-yellow-500">⭐ {review.rating}/5</span>
              </div>
              <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserReviewsDisplay;


