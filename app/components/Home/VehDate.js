"use client";

import React, { useState, useEffect } from "react";

const VehDate = ({ selectedDate, setSelectedDate }) => {
  const [weekDates, setWeekDates] = useState([]);

  useEffect(() => {
    // Obtener la fecha actual
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // Ajuste para Domingo=7
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);

    // Crear lista de fechas (Lunes-Domingo)
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date);
    }

    setWeekDates(week);
  }, []);

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="mt-4">
      <h3 className="text-green-900 font-semibold mb-1">Fecha de salida</h3>
      <div className="flex gap-2 overflow-x-auto">
        {weekDates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => handleSelectDate(date)}
            className={`px-3 py-1 rounded border transition-colors ${
              selectedDate?.toDateString() === date.toDateString()
                ? "bg-green-900 bg-opacity-30 text-green-900 font-semibold border-green-900"
                : "bg-transparent text-green-900 border-green-900"
            }`}
          >
            {date.toLocaleDateString("es-ES", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VehDate;
