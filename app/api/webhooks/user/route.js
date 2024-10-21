import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import prisma from '../../../lib/db';


const webhookSecret = process.env.WEBHOOK_SECRET;

export async function handler(request) {
  const payload = await request.json();
  const headerList = headers();
  const heads = {
    'svix-id': headerList.get('svix-id'),
    'svix-timestamp': headerList.get('svix-timestamp'),
    'svix-signature': headerList.get('svix-signature'),
  };

  const wh = new Webhook(webhookSecret);
  let evt = null;

  try {
    evt = wh.verify(JSON.stringify(payload), heads);
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const userData = evt.data;
    const { id, email_addresses, full_name, image_url, primary_email_address_id, external_id, clerk_id, posts, created_at, updated_at } = userData;

    // Asegúrate de que este valor sea correcto y existe
    const email = email_addresses.find(email => email.id === primary_email_address_id)?.email_address;

    // Verifica si el correo electrónico es válido
    if (!email) {
      console.error('No valid email found for user:', userData);
      return NextResponse.json({ error: 'No valid email found' }, { status: 400 });
    }

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
    } catch (error) {
      console.error('Error saving user to database:', error); // Más información del error
      return NextResponse.json({ error: 'Error saving user to database' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ message: 'GET request received' });
}

export async function PUT(request) {
  return NextResponse.json({ message: 'PUT request received' });
}
