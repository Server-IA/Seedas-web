import React, { useContext, useEffect, useState } from 'react';
import InputItem from './InputItem';
import { SourceContext } from '../../context/SourceContext';
import { DestinationContext } from '../../context/DestinationContext';
import { useRouter } from 'next/navigation';
import CarListOptions from './CarListOptions';
import DateSelector from './DateSelector';
import { saveProductoresToFirestore } from '../../firebase/firebaseUtils';
import { useAuth } from '@clerk/nextjs'; // Importa el hook de Clerk para obtener la info del usuario

function SearchSection() {
  const { source } = useContext(SourceContext);
  const { destination } = useContext(DestinationContext);
  const [price, setPrice] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [workingHours, setWorkingHours] = useState({ date: '', start: '', end: '' });
  const [weight, setWeight] = useState(0); // Estado para el peso
  const [phone, setPhone] = useState(''); // Estado para el teléfono
  const router = useRouter();
  const { user } = useAuth(); // Obtiene el usuario autenticado a través de Clerk
  const email = user ? user.primaryEmailAddress : ''; // Obtiene el correo del usuario

  // Cálculo del precio basado en la distancia, tipo de vehículo y peso
  useEffect(() => {
    if (source && destination && selectedCar && weight > 0) {
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
      const weightFactor = weight > 500 ? 1.5 : 1.0; // Incremento por peso mayor a 500 kg
      const calculatedPrice = (
        selectedCar.amount * dist * (baseRate / 1000) * weightFactor
      ).toFixed(2);

      setPrice(calculatedPrice);
    }
  }, [source, destination, selectedCar, weight]);

  // Manejo del pago y guardado de datos
  const handlePayment = async (paymentMethod) => {
    if (!source || !destination || !selectedCar || !workingHours.date || weight <= 0 || !phone) {
      alert('Por favor, completa todos los campos antes de continuar.');
      return;
    }

    const ProductoresData = {
      source,
      destination,
      vehicle: selectedCar.name,
      price,
      weight, // Incluye el peso en los datos guardados
      workingHours,
      phone, // Agrega el teléfono a los datos guardados
      email, // Agrega el correo a los datos guardados (sin validación)
      paymentMethod,
    };

    // Guardar datos en Firestore
    try {
      await saveProductoresToFirestore(ProductoresData);

      // Redirigir según método de pago
      if (paymentMethod === 'online') {
        router.push(`/payment?amount=${price}`);
      } else {
        alert('Pago confirmado en efectivo. Gracias por usar nuestro servicio.');
        router.push('/zonaTrabajo');
      }
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      alert('Hubo un error al guardar la información. Por favor, inténtalo nuevamente.');
    }
  };

  return (
    <div>
      <div className="p-2 md:p-6 border-[2px] rounded-xl">
        <p className="text-[20px] font-bold">Ingresa tus ubicaciones</p>
        <InputItem type="source" />
        <InputItem type="destination" />
        <div>
          <label className="block mb-2 font-semibold">Teléfono:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="Ingresa tu número de teléfono"
          />
        </div>
        <div className="my-4">
          <label htmlFor="weight" className="block font-medium">
            Peso de la carga (kg):
          </label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="w-full border p-2 rounded"
            placeholder="Ingresa el peso de la carga"
          />
        </div>
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
