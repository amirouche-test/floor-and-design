'use client'

import React from 'react'

export default function LaMarque() {
  return (
    <main>
      <section className="relative">
        <div className="relative flex w-full h-[calc(100vh-70px)] sm:h-[calc(100vh-120px)] overflow-hidden">
          {/* Image gauche */}
          <img
            src="/marque-1.png"
            alt="Atelier"
            className="flex-1 object-cover w-1/2 h-full"
            />
          {/* Image droite */}
          <img
            src="/marque-2.png"
            alt="Savoir-faire"
            className="flex-1 object-cover w-1/2 h-full"
            />

          {/* Overlay sombre */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Contenu centré */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white space-y-4 z-10">
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="w-28 md:w-36 lg:w-40 h-auto mx-auto drop-shadow"
              />
            <h1 className="text-3xl md:text-5xl font-semibold">
              Notre Marque
            </h1>
            <p className="text-lg md:text-xl max-w-2xl">
              L’élégance et le savoir-faire au cœur de chaque carreau.
            </p>
          </div>
        </div>
      </section>

      {/* Texte en dessous */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xl md:text-2xl italic text-gray-700 mb-4">
            Une signature unique pour vos espaces.
          </p>
          <p className="text-gray-500 text-base md:text-lg">
            Depuis toujours, Floor & Design s’inspire de la tradition et de la modernité pour créer des collections de carrelage élégantes, durables et raffinées.
          </p>
        </div>
      </section>
    </main>
  )
}
