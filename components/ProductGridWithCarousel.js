'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductGridWithCarousel({ products }) {
  const visibleCount = 12
  const visibleProducts = products.slice(0, visibleCount)
  const remainingProducts = products.slice(visibleCount)

  const carouselVisible = 5
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const canGoPrev = carouselIndex > 0
  const canGoNext = carouselIndex < remainingProducts.length - carouselVisible

  useEffect(() => {
    if (products.length > 0) {
      setLoading(true)
      const timer = setTimeout(() => setLoading(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [products])

  useEffect(() => {
    if (remainingProducts.length <= carouselVisible) return

    const interval = setInterval(() => {
      setCarouselIndex((prev) =>
        prev < remainingProducts.length - carouselVisible ? prev + 1 : 0
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [remainingProducts.length, carouselVisible])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
      {/* ✅ Titre et sous-titre toujours affichés */}
      <h2 className="text-center text-4xl md:text-5xl font-light tracking-wide mb-4 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent">
        Nos Produits Exclusifs
      </h2>
      <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12 text-lg md:text-xl leading-relaxed font-light">
        Une sélection pensée pour sublimer votre intérieur avec élégance et modernité.
      </p>

      {/* ✅ Grid principale */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-7">
        {loading
          ? [...Array(visibleCount)].map((_, idx) => (
              <div key={idx} className="rounded-xl bg-gray-100 shadow h-40 sm:h-52 md:h-60 animate-pulse"></div>
            ))
          : visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>

      {/* ✅ Carousel */}
      {remainingProducts.length > 0 && (
        <div className="mt-12 relative rounded-xl bg-gray-50 shadow-inner px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => canGoPrev && setCarouselIndex(carouselIndex - 1)}
              disabled={!canGoPrev}
              className="p-2 md:p-3 rounded-full bg-white border border-gray-400 hover:bg-gray-200 transition disabled:opacity-30 shadow flex items-center justify-center"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>

            <div className="overflow-hidden flex-1 mx-3">
              <div
                className="flex gap-4 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${(carouselIndex * 100) / carouselVisible}%)`,
                }}
              >
                {loading
                  ? [...Array(remainingProducts.length)].map((_, idx) => (
                      <div key={idx} className="flex-shrink-0 w-[14%] rounded-xl bg-gray-100 shadow h-32 animate-pulse"></div>
                    ))
                  : remainingProducts.map((product) => (
                      <div key={product._id} className="flex-shrink-0 w-[14%]">
                        <ProductCard product={product} small />
                      </div>
                    ))}
              </div>
            </div>

            <button
              onClick={() => canGoNext && setCarouselIndex(carouselIndex + 1)}
              disabled={!canGoNext}
              className="p-2 md:p-3 rounded-full bg-white border border-gray-400 hover:bg-gray-200 transition disabled:opacity-30 shadow flex items-center justify-center"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-12">
        <p className="text-center text-gray-500 text-base md:text-lg italic">
          Envie d’en découvrir plus ? Faites défiler et explorez notre collection.
        </p>
      </div>
    </div>
  )
}

function ProductCard({ product, small = false }) {
  return (
    <Link
      href={`/produits/${product.slug}`}
      className={`group block rounded-xl overflow-hidden bg-white shadow hover:shadow-md transition-all ${small ? 'scale-90' : ''}`}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-2 text-center">
        <h3 className={`text-gray-800 font-semibold ${small ? 'text-sm' : 'text-base md:text-lg'} line-clamp-2`}>
          {product.name}
        </h3>
        <p className={`text-gray-700 mt-1 ${small ? 'text-xs' : 'text-sm md:text-base'} font-medium`}>
          {product.price} DA
        </p>
      </div>
    </Link>
  )
}
