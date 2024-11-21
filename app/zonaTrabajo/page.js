'use client';  
import React from 'react';   
import ZoneDetails from '../components/Home/ZoneDetails';   
import ZoneList from '../components/Home/ZoneContainVeh';  
import ZoneSearch from '../components/Home/ZoneSearch';   
import ZoneContain from '../components/Home/ZoneContain';  

export default function ZonaTrabajo() {  
  return (  
    <div className="p-6 bg-[#A9B7A0] min-h-screen"> {/* Updated background color and min-height */}  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">   
          
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">  
          <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">  
            <h1 className="text-2xl font-bold mb-4">Publicaciones como Transportador</h1>  
            <ZoneList />  
          </div>  
          <div className="container mx-auto p-4 bg-white rounded-lg shadow-md md:ml-4"> {/* Added margin to the left */}  
            <h1 className="text-2xl font-bold mb-4">Publicaciones como Productor</h1>  
            <ZoneContain />  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
}