import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import PaletteCouleurs from '@/models/PaletteCouleurs'

export async function PUT(req, context) {
  try {
    await connectDB()
    const body = await req.json()
    const { nom, hex } = body
    const { id } = context.params // ✅ sans déstructuration directe

    const existing = await PaletteCouleurs.findOne({
      nom: { $regex: new RegExp(`^${nom}$`, 'i') },
      _id: { $ne: id },
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Une autre couleur porte déjà ce nom.' },
        { status: 400 }
      )
    }

    const updated = await PaletteCouleurs.findByIdAndUpdate(id, { nom, hex }, { new: true })

    if (!updated) {
      return NextResponse.json({ message: 'Couleur non trouvée' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB()
    const { id } = context.params

    const deleted = await PaletteCouleurs.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ message: 'Couleur non trouvée' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Supprimée avec succès' })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
