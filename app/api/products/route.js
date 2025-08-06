import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { NextResponse } from 'next/server'

// GET avec pagination
export async function GET(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 4 // par défaut 4 produits par page
    const skip = (page - 1) * limit

    const total = await Product.countDocuments()

    if (total === 0) {
      return NextResponse.json({
        products: [],
        page,
        totalPages: 0,
        totalItems: 0,
        message: "Aucun produit disponible.",
      })
    }

    // Trie par date de création descendante (produits récents en premier)
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return NextResponse.json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// POST - Ajouter un produit
export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()

    const product = await Product.create(body)

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erreur lors de la création du produit', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}
