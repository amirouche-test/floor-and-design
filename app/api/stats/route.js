import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import User from '@/models/User'

export async function GET() {
  try {
    await connectDB()

    const productCount = await Product.countDocuments()
    const userCount = await User.countDocuments()

    // Produits par catégorie
    const productsPerCategory = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ])

    // Top 5 produits les plus chers
    // ➜ ici on projette aussi le nombre de motifs (longueur du tableau motifs)
    const topProducts = await Product.aggregate([
      { $sort: { price: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: 1,
          price: 1,
          category: 1,
          image: 1,
          slug: 1,
          createdAt: 1,
          updatedAt: 1,
          motifCount: { $size: { $ifNull: ["$motifs", []] } } // ➜ on compte le nombre de motifs
        }
      }
    ])

    // Dernier produit ajouté (si tu veux ajouter image)
    const lastProduct = await Product.findOne()
      .sort({ createdAt: -1 })
      .select('name image slug createdAt')

    // Produits ajoutés par mois (selon ton besoin)
    const productsPerMonth = await Product.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    return Response.json({
      productCount,
      userCount,
      productsPerCategory,
      topProducts,
      lastProduct,
      productsPerMonth,
    })
  } catch (error) {
    console.error('Erreur API /api/stats:', error)
    return Response.json({ error: 'Erreur chargement stats.' }, { status: 500 })
  }
}
