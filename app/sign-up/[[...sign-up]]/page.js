'use client';
import { useEffect } from 'react';
import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';

export default function Page() {
  useEffect(() => {
    const interval = setInterval(() => {
      const firstNameInput = document.querySelector('input[name="firstName"]');
      const lastNameInput = document.querySelector('input[name="lastName"]');

      const onlyLetters = (e) => {
        const value = e.target.value;
        // Solo letras, espacios y letras con tildes
        const newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        if (value !== newValue) {
          e.target.value = newValue;
        }
      };

      if (firstNameInput && !firstNameInput.dataset.listenerAdded) {
        firstNameInput.addEventListener('input', onlyLetters);
        firstNameInput.dataset.listenerAdded = true;
      }

      if (lastNameInput && !lastNameInput.dataset.listenerAdded) {
        lastNameInput.addEventListener('input', onlyLetters);
        lastNameInput.dataset.listenerAdded = true;
      }
    }, 300); // Revisa cada 300ms por si Clerk todavía no cargó

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      <Image src="/fondo-l.jpg" alt="fondo" fill className="object-cover z-0" />
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <SignUp path="/sign-up" />
      </div>
    </div>
  );
}
