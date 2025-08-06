// /src/models/User.js

import mongoose from 'mongoose';

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,   // Bon pour éviter les doublons du style "Test@..." et "test@..."
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5       // Petite sécurité de base
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
  image: String,       // URL avatar (avec update profil)
  phone: String,       // Téléphone (avec update profil)
  address: String      // Adresse (avec update profil)
}, {
  timestamps: true     // createdAt et updatedAt automatiques
});

// Export du modèle
export default mongoose.models.User || mongoose.model('User', userSchema);
