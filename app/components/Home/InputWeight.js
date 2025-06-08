import React from "react";

function InputWeight({ weight, setWeight }) {
  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setWeight(""); // permite borrar
    } else {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        setWeight(parsed);
      }
    }
  };

  return (
    <div className="my-4">
      <label htmlFor="weight" className="block font-medium">
        Peso de la carga (kg):
      </label>
      <input
        type="number"
        id="weight"
        value={weight}
        onChange={handleChange}
        className="w-full p-2 rounded-lg bg-gray-100 focus:outline-none"
        placeholder="Ingresa el peso de la carga"
        min="0"
      />
    </div>
  );
}

export default InputWeight;
