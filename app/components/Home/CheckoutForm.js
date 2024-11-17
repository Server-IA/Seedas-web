import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';

function CheckoutForm({ amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: "http://localhost:3000/" }
    });

    if (error) setErrorMessage(error.message);
  };

  return (
    <div className='flex flex-col justify-center items-center w-full mt-6'>
      <h2 className='m-5 font-bold'>Monto a pagar: ${amount} pesos</h2>
      <form onSubmit={handleSubmit} className='max-w-md'>
        <PaymentElement />
        <button className='w-full bg-black text-white p-2 rounded-lg mt-2' disabled={!stripe}>
          Pagar en línea
        </button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default CheckoutForm;
