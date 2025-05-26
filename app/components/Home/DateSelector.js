"use client";
import React, { useEffect, useState } from "react";

const DateSelector = ({ setWorkingHours }) => {
  const [date, setDate] = useState("");

  useEffect(() => {
    // Setear la fecha actual al abrir el componente
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    setDate(todayStr);
  }, []);

  const handleChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    setWorkingHours((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  const handleBlur = () => {
    if (!date) {
      alert("Recuerda escoger para cuándo necesitas el transporte.");
    }
  };

  return (
    <div className="my-4">
      <label htmlFor="date" className="block font-medium">
        Fecha en la que necesitas el transporte:
      </label>
      <input
        type="date"
        id="date"
        value={date}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full p-2 rounded-lg bg-gray-100 focus:outline-none"
      />
    </div>
  );
};

export default DateSelector;

