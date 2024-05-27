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
    const { id, email_addresses, first_name, last_name, image_url, primary_email_address_id } = userData;

    const email = email_addresses.find(email => email.id === primary_email_address_id).email_address;

    try {
      await prisma.user.create({
        data: {
          externalId: id,
          firstName: first_name,
          lastName: last_name,
          email: email,
          imageUrl: image_url,
        },
      });
    } catch (error) {
      console.error('Error saving user to database:', error.message);
      return NextResponse.json({ error: 'Error saving user to database' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

export const POST = handler;
export const GET = handler;
export const PUT = handler;
