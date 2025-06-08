import React from "react";

function InputPhone({ phone, setPhone }) {
  const handleChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, ""); // Elimina todo lo que no sea número
    setPhone(numericValue);
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">Teléfono:</label>
      <input
        type="tel"
        value={phone}
        onChange={handleChange}
        className="p-2 border rounded w-full"
        placeholder="Ingresa tu número de teléfono"
        inputMode="numeric"
        pattern="[0-9]*"
      />
    </div>
  );
}

export default InputPhone;
