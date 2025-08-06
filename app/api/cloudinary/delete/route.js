// app/api/cloudinary/delete/route.js
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(req) {
  try {
    const body = await req.json()
    const publicId = body.publicId

    if (!publicId) {
      return new Response(JSON.stringify({ error: 'Public ID manquant' }), { status: 400 })
    }

    const result = await cloudinary.uploader.destroy(publicId)

    return new Response(JSON.stringify({ result }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
