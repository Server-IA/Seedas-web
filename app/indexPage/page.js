"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import SearchSection from "../components/Home/SearchSection";
import MapboxMap from "../components/Home/MapboxMap";
import Contain from "../components/Home/Contain";
import { SourceContext } from "../context/SourceContext";
import { DestinationContext } from "../context/DestinationContext";
import { UserIdContext } from "../context/UserIdContext";
import Solicitudes from "../components/Home/Solicitudes";
import NotiContain from "../components/Home/NotiContain";

export default function IndexPage() {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const { user, isLoaded } = useUser();
  const userId = isLoaded && user ? user.id : null;
  

  return (
    <UserIdContext.Provider value={{ userId }}>
      <SourceContext.Provider value={{ source, setSource }}>
        <DestinationContext.Provider value={{ destination, setDestination }}>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Columna 1: SearchSection */}
            <div className="md:col-span-1">
              <SearchSection />
            </div>

            {/* Columna 2: Mapa */}
            <div className="md:col-span-2 flex flex-col gap-6">
              <MapboxMap />

              <div className="p-6 bg-white border rounded-xl shadow w-full">
                <Solicitudes />
              </div>
              <div className="p-6 bg-white border rounded-xl shadow w-full">
                <NotiContain />
              </div>

              <div className="p-6 bg-white border rounded-xl shadow w-full">
                <Contain />
              </div>
            </div>
          </div>
        </DestinationContext.Provider>
      </SourceContext.Provider>
    </UserIdContext.Provider>
  );
}