"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import SearchSection from "../components/Home/SearchSection";
import MapboxMap from "../components/Home/MapboxMap";
import Contain from "../components/Home/Contain";
import { SourceContext } from "../context/SourceContext";
import { DestinationContext } from "../context/DestinationContext";
import { UserIdContext } from "../context/UserIdContext";

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
            <div>
              <SearchSection />
            </div>
            <div className="col-span-2">
              <MapboxMap />
            </div>
          </div>
          <div className="p-4 bg-white border rounded shadow-md w-full max-w-full">
            <Contain />
          </div>
        </DestinationContext.Provider>
      </SourceContext.Provider>
    </UserIdContext.Provider>
  );
}