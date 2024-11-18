'use client';

import React, { useEffect, useState } from 'react';
import { fetchProductores } from '../../firebase/firebaseUtils';

const ZoneDetailsVeh = () => {
  const [productores, setProductores] = useState([]);

  useEffect(() => {
    const loadProductores = async () => {
      const data = await fetchProductores();
      setProductores(data);
    };

    loadProductores();
  }, []);

  if (productores.length === 0) {
    return <p>No hay transportadores disponibles.</p>;
  }

  return (
    <div>
      {productores.map((prod, index) => (
        <div key={index} className="p-4 border-b">
          <h4 className="font-semibold">{prod.vehicleType}</h4>
          <p><strong>Origen:</strong> {prod.source?.text}</p>
          <p><strong>Destino:</strong> {prod.destination?.text}</p>
          <p><strong>Radio:</strong> {prod.radius} km</p>
          <p><strong>Fecha:</strong> {new Date(prod.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ZoneDetailsVeh;

