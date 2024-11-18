import React, { useContext, useEffect, useState } from 'react';
import InputItem from './InputItem';
import { SourceContext } from '../../context/SourceContext';
import { DestinationContext } from '../../context/DestinationContext';
import { useRouter } from 'next/navigation';
import CarListOptions from './CarListOptions';
import DateSelector from './DateSelector';
import { saveProductoresToFirestore } from '../../firebase/firebaseUtils';

function SearchSection() {
  const { source } = useContext(SourceContext);
  const { destination } = useContext(DestinationContext);
  const [price, setPrice] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [workingHours, setWorkingHours] = useState({ date: '', start: '', end: '' });
  const router = useRouter();

  // Cálculo del precio basado en la distancia y tipo de vehículo
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

      const baseRate = dist > 300 ? 2500 : 2000;
      const calculatedPrice = (selectedCar.amount * dist * (baseRate / 1000)).toFixed(2);
      setPrice(calculatedPrice);
    }
  }, [source, destination, selectedCar]);

  // Manejo del pago y guardado de datos
  const handlePayment = async (paymentMethod) => {
    if (!source || !destination || !selectedCar || !workingHours.date) {
      alert('Por favor, completa todos los campos antes de continuar.');
      return;
    }

    const ProductoresData = {
      source,
      destination,
      vehicle: selectedCar.name,
      price,
      workingHours,
      paymentMethod,
    };

    // Guardar datos en Firestore
    await saveProductoresToFirestore(ProductoresData);

    // Redirigir según método de pago
    if (paymentMethod === 'online') {
      router.push(`/payment?amount=${price}`);
    } else {
      alert('Pago confirmado en efectivo. Gracias por usar nuestro servicio.');
      router.push('/zonaTrabajo');
    }
  };

  return (
    <div>
      <div className="p-2 md:p-6 border-[2px] rounded-xl">
        <p className="text-[20px] font-bold">Ingresa tus ubicaciones</p>
        <InputItem type="source" />
        <InputItem type="destination" />
        <CarListOptions distance={price ? parseFloat(price) : 0} setSelectedCar={setSelectedCar} />
        <DateSelector setWorkingHours={setWorkingHours} />
        {price && (
          <div>
            <p>Precio estimado: ${price} pesos</p>
            <button
              onClick={() => handlePayment('online')}
              className="mt-3 bg-gray-900 text-white p-3 rounded mr-4"
            >
              Ir a Pago en línea
            </button>
            <button
              onClick={() => handlePayment('cash')}
              className="mt-3 bg-gray-900 text-white p-3 rounded"
            >
              Pagar en efectivo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchSection;
