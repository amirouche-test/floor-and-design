// app/api/palette-couleurs/route.js

import { connectDB } from '@/lib/db'
import { NextResponse } from 'next/server'
import PaletteCouleurs from '@/models/PaletteCouleurs'

export async function GET() {
  try {
    await connectDB()
    const couleurs = await PaletteCouleurs.find().sort({ createdAt: -1 })
    return NextResponse.json(couleurs)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()

    // Vérifier si une couleur avec le même nom existe déjà
    const existing = await PaletteCouleurs.findOne({ nom: body.nom })
    if (existing) {
      return NextResponse.json({ message: 'Cette couleur existe déjà.' }, { status: 400 })
    }

    const newCouleur = await PaletteCouleurs.create(body)
    return NextResponse.json(newCouleur, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
