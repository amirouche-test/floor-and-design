import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function PUT(req) {
  try {
    await connectDB()

    const cookieStore = await cookies()
    const token = cookieStore.get('floor-and-design-token')?.value
    const payload = await verifyToken(token)

    if (!payload) {
      return Response.json({ message: 'Non authentifié' }, { status: 401 })
    }

    const body = await req.json()

    // Nettoyage de l'email s’il est présent
    const email = body.email?.trim()?.toLowerCase()

    // Vérification de l’unicité de l’email (hors user actuel)
    if (email) {
      const existingUser = await User.findOne({ email })
      if (existingUser && existingUser._id.toString() !== payload.id) {
        return Response.json({ message: 'Email déjà utilisé' }, { status: 409 })
      }
    }

    // Mise à jour du profil
    const updatedUser = await User.findByIdAndUpdate(
      payload.id,
      {
        email,
        name: body.name,
        image: body.image,
        phone: body.phone,
        address: body.address,
      },
      { new: true }
    ).select('-password')

    if (!updatedUser) {
      return Response.json({ message: 'Utilisateur introuvable' }, { status: 404 })
    }

    return Response.json({ user: updatedUser })

  } catch (error) {
    console.error('Erreur dans PUT /api/user/update:', error)
    return Response.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}
