// app/api/user/me

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('floor-and-design-token')?.value;

    const payload = await verifyToken(token);
    if (!payload) {
      return Response.json({ message: 'Non authentifié' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return Response.json({ message: 'Utilisateur introuvable' }, { status: 404 });
    }

    return Response.json({ user });
  } catch (err) {
    console.error('Erreur dans /me:', err);
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
