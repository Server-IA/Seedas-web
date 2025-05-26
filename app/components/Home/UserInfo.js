"use client";

import React, { useContext, useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { UserIdContext } from "../../context/UserIdContext";
import { VehUserIdContext } from "../../context/VehUserIdContext";
import { useAuth } from "@clerk/nextjs";

const UserInfo = () => {
  const userId = useContext(UserIdContext);
  const vehUserId = useContext(VehUserIdContext);
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [uniqueVehicles, setUniqueVehicles] = useState([]);
  const [solicitudesCount, setSolicitudesCount] = useState(0);
  const [transportesCount, setTransportesCount] = useState(0);
  const [publicacionesCount, setPublicacionesCount] = useState(0);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null); // nuevo estado para el correo

  useEffect(() => {
    const loadUserData = async () => {
      try {
        let foundUserData = null;
        let vehiclesSet = new Set();

        // Buscar en Transportadores
        if (vehUserId) {
          const transportadoresQuery = query(
            collection(db, "Transportadores"),
            where("userId", "==", vehUserId)
          );
          const transportadoresSnap = await getDocs(transportadoresQuery);

          if (!transportadoresSnap.empty) {
            foundUserData = transportadoresSnap.docs[0].data();

            // Recopilamos vehículos únicos por marca y el teléfono
            transportadoresSnap.forEach((docSnap) => {
              const data = docSnap.data();
              if (data.vehicle) vehiclesSet.add(data.vehicle);
              if (data.phone) setPhone(data.phone);
              if (data.email) setEmail(data.email); // capturamos el correo
            });
          }
        }

        // Buscar en Productores si no encontró en Transportadores
        if (!foundUserData && userId) {
          const refProductor = doc(db, "Productores", userId);
          const snap = await getDoc(refProductor);
          if (snap.exists()) {
            foundUserData = snap.data();
            if (snap.data().phone) setPhone(snap.data().phone);
            if (snap.data().email) setEmail(snap.data().email); // capturamos el correo si existe
          }
        }

        // Actualizar userData
        if (foundUserData) {
          setUserData(foundUserData);
        } else {
          setUserData({
            userName: "Usuario desconocido",
          });
        }

        // Vehículos únicos
        setUniqueVehicles(Array.from(vehiclesSet));

        // Contar en Solicitudes
        if (vehUserId || userId) {
          const solicitudesQuery = query(
            collection(db, "Solicitudes"),
            where("transportadorId", "==", vehUserId || userId)
          );
          const solicitudesSnap = await getDocs(solicitudesQuery);
          setSolicitudesCount(solicitudesSnap.size);
        }

        // Contar en Transportadores
        if (vehUserId) {
          const transportesQuery = query(
            collection(db, "Transportadores"),
            where("userId", "==", vehUserId)
          );
          const transportesSnap = await getDocs(transportesQuery);
          setTransportesCount(transportesSnap.size);
        }

        // Contar publicaciones como Productor
        if (userId) {
          const publicacionesQuery = query(
            collection(db, "Productores"),
            where("userId", "==", userId)
          );
          const publicacionesSnap = await getDocs(publicacionesQuery);
          setPublicacionesCount(publicacionesSnap.size);
        }
      } catch (err) {
        console.error("Error al obtener los datos:", err);
      }
    };

    if (vehUserId || userId) loadUserData();
  }, [vehUserId, userId]);

  // Función para enviar WhatsApp
  const handleSendWhatsApp = () => {
    if (!phone) {
      alert("El número de teléfono no está disponible.");
      return;
    }
    const message = `Hola, me gustaría conversar contigo sobre tus trabajos en Seedas.`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Función para enviar Correo (usando el correo de la colección)
  const handleSendEmail = () => {
    if (!email) {
      alert("El correo electrónico no está disponible.");
      return;
    }
    const subject = "Interés en tus servicios";
    const body = `Hola, quisiera saber más sobre tus trabajos en Seedas.`;
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl, "_blank");
  };

  if (!userData) {
    return <p className="text-gray-600">Cargando información del usuario...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border mb-6">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Perfil del Usuario</h3>
      <div className="space-y-2 text-gray-700">
        <p><strong>👤 Nombre:</strong> {userData.userName}</p>
        {phone && <p><strong>📞 Teléfono:</strong> {phone}</p>}
        <p><strong>🚗 Vehículos:</strong> {uniqueVehicles.length > 0 ? uniqueVehicles.join(", ") : "No disponible"}</p>
        <p><strong>✉️ Correo:</strong> {email || "No disponible"}</p>
        <p><strong>📝 Solicitudes completadas:</strong> {solicitudesCount}</p>
        <p><strong>🚚 Trabajos completados (Transportes):</strong> {transportesCount}</p>
        <p><strong>📦 Publicaciones como Productor:</strong> {publicacionesCount}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={handleSendWhatsApp} className="bg-green-500 text-white px-2 py-1.5 rounded-md">
            Enviar WhatsApp
          </button>
          <button onClick={handleSendEmail} className="bg-blue-800 text-white px-2 py-1.5 rounded-md">
            Enviar Correo
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
