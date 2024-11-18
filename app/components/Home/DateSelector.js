import React, { useState } from 'react';  

const DateSelector = ({ setWorkingHours }) => {  
  const [date, setDate] = useState('');  
  const [startTime, setStartTime] = useState('');  
  const [endTime, setEndTime] = useState('');  
  const [isSaved, setIsSaved] = useState(false); // Estado para controlar la visibilidad del botón  

  const handleSave = () => {  
    if (date && startTime && endTime) {  
      setWorkingHours({ date, start: startTime, end: endTime });  
      setIsSaved(true); // Ocultar el botón después de guardar  
    } else {  
      alert('Por favor, completa todos los campos de fecha y horario.');  
    }  
  };  

  return (  
    <div className="mt-4">  
      <h3>Seleccionar Fecha y Horario</h3>  
      <div>  
        <label>Fecha:</label>  
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />  
      </div>  
      <div>  
        <label>Hora de inicio:</label>  
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />  
      </div>  
      <div>  
        <label>Hora de finalización:</label>  
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />  
      </div>  
      
      {!isSaved && ( // Renderizar el botón solo si no se ha guardado  
        <button onClick={handleSave} className="mt-0.3 bg-black text-white p-0.3 rounded">  
          guardar fecha  
        </button>  
      )}  
    </div>  
  );  
};  

export default DateSelector;