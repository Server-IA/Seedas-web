import React, { useState } from "react";

function Merchandise({ setMerchandiseData }) {
  const [merchandiseType, setMerchandiseType] = useState("");
  const [otherDescription, setOtherDescription] = useState("");

  const handleSelection = (type) => {
    setMerchandiseType(type);
    if (type !== "otros") setOtherDescription("");

    setMerchandiseData({
      type,
      description: type === "otros" ? otherDescription : "",
    });
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setOtherDescription(description);

    setMerchandiseData((prev) => ({
      ...prev,
      description,
    }));
  };

  return (
    <div className="my-4">
      <label htmlFor="merchandiseType" className="block font-medium">
        Tipo de carga:
      </label>
      <select
        id="merchandiseType"
        value={merchandiseType}
        onChange={(e) => handleSelection(e.target.value)}
        className="w-full p-2 rounded-lg bg-gray-100 focus:outline-none"
      >
        <option value="">Selecciona un tipo de carga</option>
        <option value="productos pecuarios">Productos Pecuarios</option>
        <option value="productos agrícolas">Productos Agrícolas</option>
        <option value="otros">Otros</option>
      </select>

      {merchandiseType === "otros" && (
        <div className="mt-2">
          <label
            htmlFor="otherDescription"
            className="block text-sm font-medium mb-1"
          >
            Descripción de la carga:
          </label>
          <textarea
            id="otherDescription"
            value={otherDescription}
            onChange={handleDescriptionChange}
            className="w-full p-2 rounded-lg bg-gray-100 focus:outline-none"
            placeholder="Especifica el tipo de carga..."
          ></textarea>
        </div>
      )}
    </div>
  );
}

export default Merchandise;

