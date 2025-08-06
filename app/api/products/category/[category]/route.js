import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  try {
    await connectDB()

    const category = params.category
    const { searchParams } = new URL(req.url)

    const page = parseInt(searchParams.get('page')) || 0
    const limit = parseInt(searchParams.get('limit')) || 6

    const query = { category: { $regex: new RegExp(category, 'i') } }

    const totalCount = await Product.countDocuments(query)
    const totalPages = Math.ceil(totalCount / limit)

    const products = await Product.find(query)
      .skip(page * limit)
      .limit(limit)

    return NextResponse.json({ products, totalPages })
  } catch (error) {
    console.error('Erreur GET produits par catégorie:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
