import { getSession } from '@clerk/nextjs/api';

// Función para verificar el JWT manualmente
const verifySession = async (req) => {
  try {
    const session = await getSession(req);
    if (!session || !session.userId) {
      throw new Error('No session found');
    }
    return session;
  } catch (error) {
    console.error('Session validation failed:', error);
    throw error;
  }
};

// API Route
export default async function handler(req, res) {
  try {
    const session = await verifySession(req);
    res.status(200).json({ message: 'Session is valid', session });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
}
