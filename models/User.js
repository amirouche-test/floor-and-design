// /src/models/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  name: {
    type: String,
    trim: true,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  image: String,
  phone: String,
  address: String,

  // ✅ Nouveau champ : tableau des produits likés
  likedProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product' // nom du modèle Product
    }
  ]
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', userSchema);
