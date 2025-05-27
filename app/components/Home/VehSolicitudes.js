
"use client";

const VehSolicitudes = ({ solicitudes, onConfirmar }) => {
  if (solicitudes.length === 0) {
    return <p>No hay solicitudes dirigidas a ti.</p>;
  }

  return (
    <>
      {solicitudes.map((solicitud) => (
        <div key={solicitud.id} className="border p-4 mb-4 rounded shadow">
          <p><strong>Origen:</strong> {solicitud.source?.name}</p>
          <p><strong>Destino:</strong> {solicitud.destination?.name}</p>
          <p><strong>Precio:</strong> ${solicitud.price}</p>
          <p>
            <strong>Estado:</strong>
            <span
              className={`ml-2 font-semibold ${
                solicitud.status === "confirmado"
                  ? "text-green-600"
                  : "text-yellow-500"
              }`}
            >
              {solicitud.status}
            </span>
          </p>
          {solicitud.status !== "confirmado" && (
            <button
              onClick={() => onConfirmar(solicitud)}
              className="mt-2 px-3 py-1 bg-[#800020] text-white text-sm rounded hover:bg-[#990022] transition"
            >
              Confirmar Solicitud
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default VehSolicitudes;
