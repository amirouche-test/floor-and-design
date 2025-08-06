import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  try {
    await connectDB()

    // Cherche directement par le champ `slug`
    const product = await Product.findOne({ slug: params.slug })

    if (!product) {
      return NextResponse.json({ message: 'Produit non trouvé' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erreur GET produit par slug:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
