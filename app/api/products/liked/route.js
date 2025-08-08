// src/app/api/products/liked/route.js
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';

export async function GET() {
  try {
    // 1️⃣ Récupérer le token depuis les cookies
    const token = cookies().get('floor-and-design-token')?.value;
    if (!token) {
      return Response.json({ success: false, message: 'Non authentifié', products: [] }, { status: 401 });
    }

    // 2️⃣ Vérifier le token
    const payload = await verifyToken(token);
    if (!payload) {
      return Response.json({ success: false, message: 'Token invalide', products: [] }, { status: 401 });
    }

    // 3️⃣ Connexion à la base de données
    await connectDB();

    // 4️⃣ Récupérer les IDs des produits likés
    const user = await User.findById(payload.id).select('likedProducts').lean();
    if (!user?.likedProducts?.length) {
      return Response.json({ success: true, products: [] }, { status: 200 });
    }

    // 5️⃣ Récupérer les produits correspondants
    const products = await Product.find({ _id: { $in: user.likedProducts } })
      .lean()
      .exec();

    // 6️⃣ Réponse finale
    return Response.json({ success: true, products }, { status: 200 });
  } catch (err) {
    console.error('Erreur GET /products/liked:', err);
    return Response.json({ success: false, message: 'Erreur serveur', products: [] }, { status: 500 });
  }
}
