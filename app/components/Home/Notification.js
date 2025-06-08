import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useUser } from "@clerk/nextjs";

const Notification = () => {
  const { user } = useUser();
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    if (!user) return;

    const cargarNotificaciones = async () => {
      try {
        const notisTotales = [];

        // 🔴 1. Notificaciones explícitas
        const qNotis = query(
          collection(db, "Notificaciones"),
          where("transportadorId", "==", user.id),
          orderBy("timestamp", "desc")
        );

        onSnapshot(qNotis, (snapshot) => {
          const notiDocs = snapshot.docs.map((doc) => ({
            id: doc.id,
            tipo: doc.data().tipo || "mensaje",
            mensaje: doc.data().mensaje,
            timestamp: doc.data().timestamp.toDate(),
          }));
          agregarYOrdenar([...notisTotales, ...notiDocs]);
        });

        // 🟡 2. Publicaciones canceladas
        const qProd = query(
          collection(db, "Productores"),
          where("transportadorId", "==", user.id),
          where("visible", "==", false)
        );

        const snapshotProd = await getDocs(qProd);
        const prodNotis = snapshotProd.docs.map((doc) => ({
          id: doc.id,
          tipo: "cancelacion",
          mensaje: `Publicación "${doc.data().titulo}" fue cancelada por el productor.`,
          timestamp: new Date(doc.data().updatedAt || doc.data().createdAt || Date.now()),
        }));

        // 🔵 3. Solicitudes canceladas
        const qSolicitudes = query(
          collection(db, "Solicitudes"),
          where("transportadorId", "==", user.id),
          where("estado", "==", "cancelado")
        );

        const snapshotSol = await getDocs(qSolicitudes);
        const solNotis = snapshotSol.docs.map((doc) => ({
          id: doc.id,
          tipo: "solicitud_cancelada",
          mensaje: `Solicitud con el productor "${doc.data().productorId}" fue cancelada.`,
          timestamp: new Date(doc.data().updatedAt || doc.data().createdAt || Date.now()),
        }));

        agregarYOrdenar([...notisTotales, ...prodNotis, ...solNotis]);
      } catch (error) {
        console.error("❌ Error cargando notificaciones:", error);
      }
    };

    const agregarYOrdenar = (notis) => {
      const ordenadas = [...notis].sort((a, b) => b.timestamp - a.timestamp);
      setNotificaciones(ordenadas);
    };

    cargarNotificaciones();
  }, [user]);

  const getBadge = (tipo) => {
    switch (tipo) {
      case "cancelacion":
        return <span className="text-red-600 text-sm font-semibold">🚫 Cancelación</span>;
      case "solicitud_cancelada":
        return <span className="text-yellow-600 text-sm font-semibold">📄 Solicitud</span>;
      default:
        return <span className="text-blue-600 text-sm font-semibold">💬 Mensaje</span>;
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow border">
      <h2 className="text-xl font-bold mb-4 text-gray-800">🔔 Notificaciones</h2>
      {notificaciones.length === 0 ? (
        <p className="text-gray-500">No tienes notificaciones nuevas.</p>
      ) : (
        <ul className="space-y-4">
          {notificaciones.map((noti, index) => (
            <li
              key={`${noti.id}_${index}`}
              className="p-4 border rounded-md hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center mb-1">
                {getBadge(noti.tipo)}
                <small className="text-gray-400">
                  {noti.timestamp.toLocaleString()}
                </small>
              </div>
              <p className="text-gray-700">{noti.mensaje}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
