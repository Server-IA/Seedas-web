const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const createNotification = async ({ userId, mensaje, tipo }) => {
  return db.collection("Notificaciones").add({
    transportadorId: userId,
    mensaje,
    tipo,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
};

const handleVisibilityChange = async (change, context, collectionName) => {
  const before = change.before.data();
  const after = change.after.data();

  if (before.visible === after.visible) return null;

  const changedBy = after.updatedBy || null;

  const notificaciones = [];

  const posiblesUsuarios = [
    after.transportadorId,
    after.productorId,
    after.userId,
  ].filter((uid) => uid && uid !== changedBy);

  for (const uid of posiblesUsuarios) {
    notificaciones.push(
      createNotification({
        userId: uid,
        mensaje: `⚠️ La visibilidad de una publicación en "${collectionName}" cambió.`,
        tipo: "visibilidad",
      })
    );
  }

  return Promise.all(notificaciones);
};

const generarFuncion = (coleccion) =>
  functions.firestore
    .document(`${coleccion}/{docId}`)
    .onUpdate((change, context) =>
      handleVisibilityChange(change, context, coleccion)
    );

exports.onVehComunitarioChange = generarFuncion("VehComunitario");
exports.onProductoresChange = generarFuncion("Productores");
exports.onTransportadoresChange = generarFuncion("Transportadores");
exports.onSolicitudesChange = generarFuncion("Solicitudes");
