// app/api/products/[id]/route.js

import { connectDB } from '@/lib/db'
import Product from '@/models/Product'
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(req, { params }) {
  try {
    await connectDB()
    const product = await Product.findById(params.id)

    if (!product) {
      return Response.json({ message: 'Produit introuvable' }, { status: 404 })
    }

    if (product.image) {
      const publicId = getPublicIdFromUrl(product.image)
      if (publicId) await cloudinary.uploader.destroy(publicId)
    }

    for (const motif of product.motifs) {
      for (const calque of motif.calques) {
        if (calque.image) {
          const publicId = getPublicIdFromUrl(calque.image)
          if (publicId) await cloudinary.uploader.destroy(publicId)
        }
      }
    }

    const folder = `produits/${product.name}`
    await cloudinary.api.delete_resources_by_prefix(folder)
    await cloudinary.api.delete_folder(folder)

    await Product.findByIdAndDelete(params.id)

    return Response.json({ message: 'Produit supprimé' })
  } catch (error) {
    console.error('Erreur suppression produit', error)
    return Response.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

function getPublicIdFromUrl(url) {
  try {
    const parts = url.split('/')
    const fileWithExt = parts.at(-1)
    const [publicId] = fileWithExt.split('.')
    const folderPath = parts.slice(parts.indexOf('upload') + 1, -1).join('/')
    return folderPath ? `${folderPath}/${publicId}` : publicId
  } catch {
    return null
  }
}


// GET un seul produit
export async function GET(req, { params }) {
  try {
    await connectDB()
    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json({ message: 'Produit non trouvé' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erreur GET produit:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

  
  

// PUT modifier un produit
export async function PUT(req, { params }) {
  try {
    await connectDB()

    const updates = await req.json()
    const productId = params.id

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true })

    if (!updatedProduct) {
      return NextResponse.json({ message: 'Produit non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Produit mis à jour', updatedProduct })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}


