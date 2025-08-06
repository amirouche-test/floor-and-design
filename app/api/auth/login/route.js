import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return Response.json({ message: 'Mot de passe incorrect' }, { status: 401 });
    }

    // ✅ ATTENTION : `signToken` est maintenant ASYNCHRONE avec `jose`
    const token = await signToken(user);

    const cookieStore = await cookies();
    cookieStore.set('floor-and-design-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return Response.json({
      message: 'Connexion réussie',
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erreur dans login:', error);
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
