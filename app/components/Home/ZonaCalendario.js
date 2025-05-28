"use client";

import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import ZonaVehCard from "./ZonaVehCard";

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const ZonaCalendario = () => {
  const [transportesPorDia, setTransportesPorDia] = useState({});
  const [fechasSemana, setFechasSemana] = useState([]);
  const fechaReferencia = useRef(new Date().toDateString());

  const obtenerSemanaActual = () => {
    const hoy = new Date();
    const dia = hoy.getDay() === 0 ? 7 : hoy.getDay();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - dia + 1);
    const semana = [];
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);
      semana.push(fecha);
    }
    setFechasSemana(semana);
  };

  const cargarTransportes = async (fechas) => {
    const snapshot = await getDocs(collection(db, "VehComunitario"));
    const datos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const agrupados = {};
    for (const fecha of fechas) {
      const diaNombre = diasSemana[fecha.getDay() === 0 ? 6 : fecha.getDay() - 1];
      agrupados[diaNombre] = datos.filter((item) => {
        const itemFecha = item.date?.toDate?.() || new Date(item.date);
        return itemFecha.toDateString() === fecha.toDateString();
      });
    }

    setTransportesPorDia(agrupados);
  };

  useEffect(() => {
    obtenerSemanaActual();
  }, []);

  useEffect(() => {
    if (fechasSemana.length > 0) {
      cargarTransportes(fechasSemana);
    }
  }, [fechasSemana]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      const hoy = new Date().toDateString();
      if (hoy !== fechaReferencia.current) {
        fechaReferencia.current = hoy;
        obtenerSemanaActual();
      }
    }, 60 * 1000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="w-full overflow-x-auto py-6 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-900">
        Transporte Comunitario - Semana Actual
      </h2>
      <div className="grid grid-cols-7 gap-4 min-w-[1200px]">
        {fechasSemana.map((fecha, idx) => {
          const diaNombre = diasSemana[fecha.getDay() === 0 ? 6 : fecha.getDay() - 1];
          const lista = transportesPorDia[diaNombre] || [];

          return (
            <div
              key={diaNombre}
              className="bg-white shadow-lg rounded-xl p-3 flex flex-col"
            >
              <h3 className="text-center text-lg font-semibold text-green-800">
                {diaNombre}
              </h3>
              <p className="text-sm text-center text-gray-500 mb-2">
                {fecha.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </p>

              <div className="flex-1 overflow-y-auto max-h-72 space-y-2">
                {lista.length === 0 ? (
                  <p className="text-xs text-center text-gray-400">Sin transportes</p>
                ) : (
                  lista.slice(0, 3).map((item) => (
                    <ZonaVehCard key={item.id} transporte={item} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ZonaCalendario;
