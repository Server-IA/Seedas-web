"use client";

import React, { useState } from "react";
import VehComunitario from "./VehComunitario";
import VehFormProductor from "./VehFormProductor";

function VehSearchSection() {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className="p-4 border rounded-lg mb-8">
      <h2 className="text-xl font-bold text-black mb-2">Publicación de Transporte</h2>
      <p className="text-sm text-gray-600 mb-4">Selecciona una </p>

      <div className="flex gap-4 mb-6">
        <div
          className={`p-6 rounded cursor-pointer border-2 border-black transition-all duration-200 shadow-sm hover:shadow-lg ${
            selectedOption === "comunitario"
              ? "bg-green-900 bg-opacity-30 text-black font-semibold"
              : "bg-transparent text-black"
          }`}
          onClick={() => setSelectedOption("comunitario")}
        >
          <p>🚗 Transporte Comunitario</p>
        </div>

        <div
          className={`p-6 rounded cursor-pointer border-2 border-black transition-all duration-200 shadow-sm hover:shadow-lg ${
            selectedOption === "productor"
              ? "bg-green-900 bg-opacity-30 text-black font-semibold"
              : "bg-transparent text-black"
          }`}
          onClick={() => setSelectedOption("productor")}
        >
          <p>🌾 Transporte para Productor</p>
        </div>
      </div>

      {selectedOption === "comunitario" && <VehComunitario />}
      {selectedOption === "productor" && <VehFormProductor />}
    </div>
  );
}

export default VehSearchSection;
