'use client'
import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return(
  <>
 
  <div>
    <Image src = '/fondo-l.jpg'width={800} height={500} 
    className="object-contain h-full w-full"/>
    <div className="absolute top-28 right-60">
        <SignUp path="/sign-up" />
    </div>
  </div>
  </>
  )
}