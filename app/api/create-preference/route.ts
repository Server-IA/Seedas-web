import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const mercadopago = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { price, title, quantity, metadata } = body;

    // Validaciones
    if (!price || price <= 0) {
      return NextResponse.json(
        { error: "Precio inválido" },
        { status: 400 }
      );
    }
    console.log("Voy a crear la preferencia para el pago");
      
    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            id: "message",
            title,
            unit_price: price,
            quantity,
            currency_id: "COP"
          },
        ],
        metadata,
      },
    });

    return NextResponse.json(preference);
  } catch (error) {
    console.error("Error creating preference:", error);
    return NextResponse.json(
      { error: "Error al crear la preferencia de pago" },
      { status: 500 }
    );
  }
}