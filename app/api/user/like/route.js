// app/api/user/like/route.js
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('floor-and-design-token')?.value;

    // Vérification de l'authentification
    const payload = await verifyToken(token);
    if (!payload) {
      return Response.json({ success: false, message: 'Vous devez être connecté pour faire cette action.' }, { status: 401 });
    }

    const { itemId } = await req.json();
    if (!itemId) {
      return Response.json({ success: false, message: 'ID manquant.' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(payload.id);
    if (!user) {
      return Response.json({ success: false, message: 'Utilisateur introuvable.' }, { status: 404 });
    }

    // Si l'ID est déjà présent → on le retire
    if (user.likedProducts.includes(itemId)) {
      user.likedProducts = user.likedProducts.filter(id => id.toString() !== itemId);
      await user.save();
      return Response.json({ success: true, message: 'Retiré des favoris.' });
    }

    // Sinon → on l'ajoute
    user.likedProducts.push(itemId);
    await user.save();

    return Response.json({ success: true, message: 'Ajouté aux favoris.' });

  } catch (err) {
    console.error('Erreur dans /user/like:', err);
    return Response.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}
