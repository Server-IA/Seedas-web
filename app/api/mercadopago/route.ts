import {Payment, MercadoPagoConfig} from "mercadopago";
import {revalidatePath} from "next/cache";

//import api, {mercadopago} from "@/api";
const mercadopago = new MercadoPagoConfig({ 
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
  });

export async function POST(request: Request) {
  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body: {data: {id: string}} = await request.json();
  console.log("mercadopago endpoint")
  // Obtenemos el pago
  const payment = await new Payment(mercadopago).get({id: body.data.id});

  // Si se aprueba, agregamos el mensaje
  if (payment.status === "approved") {
    // Obtenemos los datos
    //await api.message.add({id: payment.id!, text: payment.metadata.text});
    console.log({id: payment.id!, text: payment.metadata.text})
    // Revalidamos la página de inicio para mostrar los datos actualizados
    revalidatePath("/");
  }

  // Respondemos con un estado 200 para indicarle que la notificación fue recibida
  return new Response(null, {status: 200});
}