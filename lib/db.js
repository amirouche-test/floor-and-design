// /src/lib/db.js

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Connexion unique à MongoDB (singleton)
export async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return; // déjà connecté
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connecté');
  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
    throw error;
  }
}
