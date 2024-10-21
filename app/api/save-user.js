/*// app/api/save-user.js

import { NextResponse } from 'next/server';
import prisma from '@./prisma';

// Maneja la solicitud POST para guardar el usuario
export async function POST(request) {
  const { clerkId, email } = await request.json();

  try {
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: { email },
      create: { clerkId, email },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Error saving user' }, { status: 500 });
  }
} */
