import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import prisma from '../../../lib/db';

// Obtén el secreto del webhook de las variables de entorno
const webhookSecret = process.env.WEBHOOK_SECRET;

// Handler principal para manejar la solicitud del webhook
export async function POST(request: Request) {
  // Intenta extraer el payload JSON de la solicitud
  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    console.error('Error parsing JSON payload:', error);
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  // Obtén las cabeceras necesarias para verificar la firma del webhook
  const headerList = headers();
  const heads = {
    'svix-id': headerList.get('svix-id') || '',
    'svix-timestamp': headerList.get('svix-timestamp') || '',
    'svix-signature': headerList.get('svix-signature') || '',
  };

  const wh = new Webhook(webhookSecret);
  let evt = null;

  // Verifica la autenticidad del webhook usando Svix
  try {
    evt = wh.verify(JSON.stringify(payload), heads);
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }

  // Obtén el tipo de evento desde el payload verificado
  const eventType = evt.type;

  // Procesa el evento 'user.created'
  if (eventType === 'user.created') {
    const userData = evt.data;
    const { id, email_addresses, full_name, image_url, primary_email_address_id, external_id, clerk_id, posts, created_at, updated_at } = userData;

    // Busca el correo electrónico primario del usuario
    const email = email_addresses.find((email: { id: string }) => email.id === primary_email_address_id)?.email_address;

    if (!email) {
      console.error('No valid email found for user:', userData);
      return NextResponse.json({ error: 'No valid email found' }, { status: 400 });
    }

    // Intenta guardar los datos del usuario en la base de datos
    try {
      await prisma.user.create({
        data: {
          id: id,
          email: email, // Guarda solo el correo electrónico
          fullName: full_name,
          imageUrl: image_url,
          externalId: external_id,
          clerkId: clerk_id,
          posts: posts,
          createdAt: created_at,
          updatedAt: updated_at,
        },
      });
      console.log('User created successfully in the database:', email);
    } catch (error) {
      console.error('Error saving user to database:', error);
      return NextResponse.json({ error: 'Error saving user to database' }, { status: 500 });
    }
  } else {
    console.warn(`Unhandled event type: ${eventType}`);
    return NextResponse.json({ message: 'Unhandled event type' }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}

// Respuestas simples para las solicitudes GET y PUT
export async function GET() {
  return NextResponse.json({ message: 'GET request received' });
}

export async function PUT(request: Request) {
  return NextResponse.json({ message: 'PUT request received' });
}
