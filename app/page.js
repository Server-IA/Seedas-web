
'use client'
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4">Bienvenido a Seedas</h1>
        <p className="text-xl"> Somos la nueva forma de conectar productores con transportadores de manera eficiente colaborativa y sin intermediarios .</p>
      </header>

  
      {/* Text and Image Sections */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 w-full max-w-5xl px-4">
        <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Productores</h2>
          <p className="text-center mb-4">Accede a una red de transporte confiable para mover tu producción.</p>
          <Image src="/LOGO-SEEDAS.jpg" alt="Farmers" width={300} height={200} className="rounded-lg" />
        </div>
        <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Transportadores</h2>
          <p className="text-center mb-4">Consigue trabajos logísticos fácilmente con productores Y usuarios verificados.</p>
          <Image src="/LOGO-SEEDAS.jpg" alt="Transporters" width={300} height={200} className="rounded-lg" />
        </div>
        <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Seedas</h2>
          <p className="text-center mb-4">Explora la plataforma Seedas: rápida, segura y basada en tecnología moderna.</p>
          <Image src="/LOGO-SEEDAS.jpg" alt="Transporters" width={300} height={200} className="rounded-lg" />
        </div>
      </section>

    </div>
  );
}
