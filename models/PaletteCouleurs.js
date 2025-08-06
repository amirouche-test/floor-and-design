import mongoose from 'mongoose'

const PaletteCouleursSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    hex: {
      type: String,
      required: true,
      match: /^#([0-9A-Fa-f]{3}){1,2}$/,  // vérifie format hexadécimal
      uppercase: true
    }
  },
  {
    timestamps: true // ajoute automatiquement createdAt et updatedAt
  }
)

export default mongoose.models.PaletteCouleurs || mongoose.model('PaletteCouleurs', PaletteCouleursSchema)
