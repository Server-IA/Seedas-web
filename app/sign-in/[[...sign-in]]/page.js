'use client';
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
  <>
 
  <div>
    <Image src = '/fondo-l.jpg'width={800} height={500} alt="fondo"
    className="object-contain h-full w-full"/>
    <div className="absolute top-28 right-60">
        <SignIn path="/sign-in" />
    </div>
  </div>
  </>
  )
}