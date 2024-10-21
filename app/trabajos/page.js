'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const ZonaDeTrabajo = () => {
    const [zona, setZona] = useState('');
    const [role, setRole] = useState('all');
    const [publicaciones, setPublicaciones] = useState([]);
    const [trabajosPendientes, setTrabajosPendientes] = useState([]);

    const router = useRouter();

    useEffect(() => {
        // Simulate fetching data
        const fetchedPublicaciones = [
            { id: 1, title: 'Publicación 1', description: 'Descripción 1', role: 'productor', zona: 'zona1' },
            { id: 2, title: 'Publicación 2', description: 'Descripción 2', role: 'transportador', zona: 'zona2' },
            // Add more mock data as needed
        ];
        setPublicaciones(fetchedPublicaciones);
    }, []);

    const handleSearch = () => {
        const fetchedPublicaciones = [
            { id: 1, title: 'Publicación 1', description: 'Descripción 1', role: 'productor', zona: 'zona1' },
            { id: 2, title: 'Publicación 2', description: 'Descripción 2', role: 'transportador', zona: 'zona2' },
            // Add more mock data as needed
        ];

        const filteredPublicaciones = fetchedPublicaciones.filter(pub => {
            return (role === 'all' || pub.role === role) && (zona === '' || pub.zona.includes(zona));
        });

        setPublicaciones(filteredPublicaciones);
    };

    return (
        <div className="p-5">
            <h1 className="text-3xl font-bold mb-5">Zona de Trabajo</h1>

            <div className="mb-10">
                <h2 className="text-2xl font-bold mb-3">Nuestras Publicaciones</h2>
                <div>
                    {publicaciones.length === 0 ? (
                        <p>No hay publicaciones disponibles.</p>
                    ) : (
                        publicaciones.map(pub => (
                            <div key={pub.id} className="mb-4 p-4 border rounded shadow-md bg-white">
                                <h3 className="text-xl font-semibold">{pub.title}</h3>
                                <p>{pub.description}</p>
                                <p><strong>Rol:</strong> {pub.role}</p>
                                <p><strong>Zona:</strong> {pub.zona}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-bold mb-3">Trabajos Pendientes</h2>
                <div>
                    {trabajosPendientes.length === 0 ? (
                        <p>No hay trabajos pendientes.</p>
                    ) : (
                        trabajosPendientes.map(trab => (
                            <div key={trab.id} className="mb-4 p-4 border rounded shadow-md bg-white">
                                <h3 className="text-xl font-semibold">{trab.title}</h3>
                                <p>{trab.description}</p>
                                <p><strong>Transportador:</strong> {trab.transportador}</p>
                                <p><strong>Usuario:</strong> {trab.usuario}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-bold mb-3">Buscar por Zonas</h2>
                <div className="mb-4 flex flex-col md:flex-row gap-4">
                    <input 
                        type="text" 
                        value={zona} 
                        onChange={e => setZona(e.target.value)} 
                        placeholder="Ingresa la zona" 
                        className="p-2 border rounded w-full md:w-1/2"
                    />
                    <select 
                        value={role} 
                        onChange={e => setRole(e.target.value)} 
                        className="p-2 border rounded w-full md:w-1/2"
                    >
                        <option value="all">Todos</option>
                        <option value="productor">Productor</option>
                        <option value="transportador">Transportador</option>
                    </select>
                </div>
                <button 
                    onClick={handleSearch} 
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Buscar
                </button>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-bold mb-3">Mapa</h2>
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={10}
                    >
                        <Marker position={center} />
                        {/* Add more markers as needed */}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
};

export default ZonaDeTrabajo;
