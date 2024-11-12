import React, { useContext, useEffect, useState } from 'react';
import InputItem from './InputItem';
import { SourceContext } from '../../context/SourceContext';
import { DestinationContext } from '../../context/DestinationContext';
import { useRouter } from 'next/navigation';
import CarListOptions from './CarListOptions';

function SearchSection() {
  const { source } = useContext(SourceContext);
  const { destination } = useContext(DestinationContext);
  const [price, setPrice] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (source && destination && selectedCar) {
      const R = 6371; // Radio de la Tierra en km
      const dLat = (destination.lat - source.lat) * (Math.PI / 180);
      const dLng = (destination.lng - source.lng) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(source.lat * (Math.PI / 180)) *
          Math.cos(destination.lat * (Math.PI / 180)) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = R * c;

      // Ajuste de precio por km basado en la distancia
      const baseRate = dist > 300 ? 2500 : 2000; // Subir precio base si la distancia es mayor a 300 km
      const calculatedPrice = (selectedCar.amount * dist * (baseRate / 1000)).toFixed(2);
      setPrice(calculatedPrice);
    }
  }, [source, destination, selectedCar]);

  const handlePayment = () => {
    if (price) {
      const paymentMethod = window.confirm("¿Desea pagar en efectivo?");
      if (paymentMethod) {
        alert("Pago confirmado en efectivo. Gracias por usar nuestro servicio.");
      } else {
        router.push(`/payment?amount=${price}`);
      }
    }
  };

  return (
    <div>
      <div className='p-2 md:-6 border-[2px] rounded-xl'>
        <p className='text-[20px] font-bold'>Enter your locations</p>
        <InputItem type='source' />
        <InputItem type='destination' />
        <CarListOptions distance={price ? parseFloat(price) : 0} setSelectedCar={setSelectedCar} />
        {price && (
          <div>
            <p>Precio estimado: ${price} pesos</p>
            <button onClick={handlePayment} className="mt-3 bg-gray-900 text-white p-2 rounded">
              Ir al pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchSection;
