import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
  <>
 
  <div>
    <Image src = '/fondo-l.jpg'width={900} height={1000} 
    className="object-contain h-full w-full"/>
    <div className="absolute top-28 right-30">
        <SignIn path="/sign-in" />
    </div>
  </div>
  </>
  )
}