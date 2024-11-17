"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PaymentProps {
  price: number;
}

/**
 * Payment component that handles MercadoPago payment flow
 * @param {PaymentProps} props - Component properties containing payment details
 * @returns {JSX.Element} Payment component with payment button and status
 */
export default function Payment({ price }: PaymentProps): JSX.Element {
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  /**
   * Creates payment preference and generates payment link
   */
  const createPreference = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: Math.round(price),
          title: "Mensaje de muro",
          quantity: 1,
          metadata: {
            text: "bolsa de datos que es lo que mercado pago me va a devolver",
          }
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la preferencia de pago");
      }

      const data = await response.json();
      setPaymentLink(data.init_point);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Payment error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <button
        onClick={createPreference}
        disabled={isLoading}
        className={`bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-200 
          ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
      >
        {isLoading ? "Procesando..." : "Generar Link de Pago"}
      </button>

      {error && (
        <div className="mt-4 text-red-500">
          {error}
        </div>
      )}
      
      {paymentLink && (
        <div className="mt-4">
          <p className="text-gray-700 font-semibold">Link de pago generado:</p>
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Ir a Pagar
          </a>
        </div>
      )}
    </div>
  );
}