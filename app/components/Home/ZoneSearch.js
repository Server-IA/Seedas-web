import React, { useState } from 'react';

const ZoneSearch = ({ onSearch }) => {
    const [zona, setZona] = useState('');
    const [role, setRole] = useState('all');

    const handleSearch = () => {
        onSearch({ zona, role });
    };

    return (
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
                    <option value="productor" className='col col-span-2'>Productor</option>
                    <option value="transportador" className='col col-span-2'>Transportador</option>
                </select>
            </div>
            <button
                onClick={handleSearch}
                className="bg-black text-white px-4 py-2 rounded"
            >
                Buscar
            </button>
        </div>
    );
};

export default ZoneSearch;
