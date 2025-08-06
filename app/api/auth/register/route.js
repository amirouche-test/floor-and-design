import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();
    const { email, password, name } = await req.json();

    // Vérifier que les champs obligatoires sont présents
    if (!email || !password || !name) {
      return Response.json({ message: 'Email, mot de passe et nom requis' }, { status: 400 });
    }

    // Vérifier que l'email a un format correct
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ message: 'Format d\'email invalide' }, { status: 400 });
    }

    // Vérifier que l'email n'existe pas déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: 'Cet email est déjà utilisé' }, { status: 400 });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouvel utilisateur
    await User.create({
      email,
      password: hashedPassword,
      name
    });

    return Response.json({ message: 'Inscription réussie' });
  } catch (error) {
    console.error('Erreur dans register:', error);
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
