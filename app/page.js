'use client'

import { useEffect, useState } from 'react'
import ProductGridWithCarousel from '@/components/ProductGridWithCarousel'

const TOTAL = 5 // nombre d’images de fond

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [current, setCurrent] = useState(1)
  const [next, setNext] = useState(2)
  const [showNext, setShowNext] = useState(false)

  // ✅ Animation fond
  useEffect(() => {
    const interval = setInterval(() => {
      setShowNext(true)
      setTimeout(() => {
        setCurrent(next)
        setNext((next % TOTAL) + 1)
        setShowNext(false)
      }, 1000)
    }, 5000)
    return () => clearInterval(interval)
  }, [next])

  // ✅ Charger produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=30')
        if (!res.ok) throw new Error('Erreur lors du chargement')
        const data = await res.json()
        setProducts(Array.isArray(data) ? data : data.products || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="relative">
      {/* === Hero Section === */}
      <section className="relative min-h-screen overflow-hidden">
        <img
          src={`/background-${current}.jpg`}
          alt={`Fond ${current}`}
          className="absolute inset-0 w-full h-full object-cover z-[-30] pointer-events-none select-none"
        />
        {showNext && (
          <img
            src={`/background-${next}.jpg`}
            alt={`Fond ${next}`}
            className="absolute inset-0 w-full h-full object-cover z-[-20] opacity-0 animate-fadeIn pointer-events-none select-none"
          />
        )}
        <div className="absolute inset-0 bg-black/30 z-10" />

        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 text-center text-white z-20 px-4 w-full max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide drop-shadow-lg font-serif">
            L&apos;élégance à chaque détail
          </h1>
          <p className="mt-5 text-2xl text-white/90 leading-relaxed font-serif">
            Des collections pensées pour sublimer votre intérieur avec raffinement.
          </p>
        </div>
      </section>

      {/* === Produits === */}
      <section className="bg-white py-16 px-4 text-gray-900">
        <ProductGridWithCarousel products={products} />
      </section>

    </div>
  )
}
