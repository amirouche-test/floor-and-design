// http://localhost:3000/api/palette-couleurs/import-colors

import path from 'path';
import fs from 'fs/promises';
import { connectDB } from '@/lib/db';
import PaletteCouleurs from '@/models/PaletteCouleurs';

export async function GET() {
  try {
    await connectDB();

    const filePath = path.join(process.cwd(), 'utils', 'couleurs.json');
    const jsonStr = await fs.readFile(filePath, 'utf-8');
    const couleurs = JSON.parse(jsonStr);

    if (typeof couleurs !== 'object' || couleurs === null) {
      return new Response(JSON.stringify({ success: false, message: 'Format JSON invalide' }), { status: 400 });
    }

    const couleursToInsert = [];

    for (const [nom, hex] of Object.entries(couleurs)) {
      if (typeof hex === 'string' && /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(hex)) {
        const exists = await PaletteCouleurs.findOne({ nom });
        if (!exists) {
          couleursToInsert.push({ nom, hex: hex.toUpperCase() });
        }
      }
    }

    if (couleursToInsert.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'Toutes les couleurs existent déjà' }), { status: 200 });
    }

    await PaletteCouleurs.insertMany(couleursToInsert);

    return new Response(JSON.stringify({ success: true, inserted: couleursToInsert.length }), { status: 201 });
  } catch (error) {
    console.error('Erreur import couleurs:', error);
    return new Response(JSON.stringify({ success: false, message: 'Erreur serveur' }), { status: 500 });
  }
}
