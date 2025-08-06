'use client'

import Link from 'next/link'

export default function Simulateur3D() {
  return (
    <main>
      {/* Hero section */}
      <section className="relative">
        <div className="relative w-full h-[calc(100vh-70px)] sm:h-[calc(100vh-120px)] overflow-hidden">
          {/* Image de fond */}
          {/* <img
            src="/simulateur-bg-1.jpg" // à remplacer par une belle image 3D réaliste
            alt="Simulateur 3D"
            className="absolute inset-0 w-full h-full object-cover object-center"
          /> */}
          {/* Image gauche */}
          {/* <img
            src="/simulateur-bg-1.jpg"
            alt="Atelier"
            className="flex-1 object-cover w-1/2 h-full"
            /> */}
          {/* Image droite */}
          {/* <img
            src="/simulateur-bg-2.jpg"
            alt="Savoir-faire"
            className="flex-1 object-cover w-1/2 h-full"
            /> */}

          {/* Overlay sombre */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Contenu centré */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 space-y-4">
            <h1 className="text-4xl md:text-5xl font-semibold drop-shadow">
              Visualisez votre sol en 3D
            </h1>
            <p className="text-lg md:text-xl max-w-2xl">
              Composez et prévisualisez vos motifs et couleurs en temps réel, avant de concrétiser votre projet.
            </p>
            <Link
              href="/simulateur-3d/start" // par ex. la page réelle du simulateur
              className="mt-4 inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full text-base md:text-lg transition"
            >
              Lancer le simulateur
            </Link>
          </div>
        </div>
      </section>

      {/* Petit texte ou mise en avant */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xl md:text-2xl italic text-gray-700 mb-4">
            Imaginez, testez, créez.
          </p>
          <p className="text-gray-500 text-base md:text-lg">
            Notre simulateur 3D vous aide à choisir les combinaisons parfaites pour vos espaces, selon vos envies et vos inspirations.
          </p>
        </div>
      </section>
    </main>
  )
}
