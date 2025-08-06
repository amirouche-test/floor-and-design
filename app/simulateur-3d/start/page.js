'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function SimulateurStart() {
  return (
    <main className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 relative">

      {/* Carte en verre */}
      <div className="backdrop-blur-md bg-white/70 border border-white/30 shadow-xl rounded-2xl p-8 md:p-12 max-w-lg text-center space-y-5 animate-fade-in">
        {/* Logo */}
        <img src="/logo-2.svg" alt="Logo" className="w-24 md:w-28 mx-auto drop-shadow" />

        {/* Titre */}
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">
          Module en développement
        </h1>

        {/* Message */}
        <p className="text-lg md:text-xl text-gray-600">
          🛠 Ce module est en cours de développement et sera disponible très bientôt.
        </p>
      </div>

    </main>
  )
}
