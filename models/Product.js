import mongoose from 'mongoose'
import { getSlugByName } from '@/utils/slug'

const CalqueSchema = new mongoose.Schema({
  couleur: String,
  image: String,
})

const MotifSchema = new mongoose.Schema({
  nom: String,
  calques: [CalqueSchema],
})

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    slug: { type: String, unique: true },
    image: String,
    category: [String],
    description: String,
    price: Number,
    motifs: [MotifSchema],
  },
  {
    timestamps: true,
  }
)

// Génération auto du slug avant save
ProductSchema.pre('save', async function(next) {
  if (!this.isModified('name')) return next()

  let baseSlug = getSlugByName(this.name)
  let uniqueSlug = baseSlug
  let counter = 1

  while (await mongoose.models.Product.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${baseSlug}-${counter}`
    counter++
  }

  this.slug = uniqueSlug
  next()
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
