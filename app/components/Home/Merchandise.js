import React, { useState } from 'react';

function Merchandise({ setMerchandiseData }) {
  const [merchandiseType, setMerchandiseType] = useState('');
  const [otherDescription, setOtherDescription] = useState('');

  const handleSelection = (type) => {
    setMerchandiseType(type);

    // Limpia la descripción si no es "otros"
    if (type !== 'otros') {
      setOtherDescription('');
    }

    // Actualiza los datos al seleccionar un tipo
    setMerchandiseData({
      type,
      description: type === 'otros' ? otherDescription : '',
    });
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setOtherDescription(description);

    // Actualiza los datos con la descripción
    setMerchandiseData((prev) => ({
      ...prev,
      description,
    }));
  };

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-bold mb-2">Define el tipo de carga</h3>
      <div className="flex flex-col gap-2">
        <label>
          <input
            type="radio"
            name="merchandiseType"
            value="productos pecuarios"
            checked={merchandiseType === 'productos pecuarios'}
            onChange={() => handleSelection('productos pecuarios')}
            className="mr-2"
          />
          Productos Pecuarios
        </label>
        <label>
          <input
            type="radio"
            name="merchandiseType"
            value="productos agrícolas"
            checked={merchandiseType === 'productos agrícolas'}
            onChange={() => handleSelection('productos agrícolas')}
            className="mr-2"
          />
          Productos Agrícolas
        </label>
        <label>
          <input
            type="radio"
            name="merchandiseType"
            value="otros"
            checked={merchandiseType === 'otros'}
            onChange={() => handleSelection('otros')}
            className="mr-2"
          />
          Otros
        </label>
        {merchandiseType === 'otros' && (
          <div className="mt-2">
            <label className="block text-sm font-medium mb-1">
              Descripción de la carga:
            </label>
            <textarea
              value={otherDescription}
              onChange={handleDescriptionChange}
              className="w-full border p-2 rounded"
              placeholder="Especifica el tipo de carga..."
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
}

export default Merchandise;
