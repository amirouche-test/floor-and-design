'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

export default function CategoryPage() {
  const params = useParams()
  const category = params.category

  const [products, setProducts] = useState([])
  const [likedProducts, setLikedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const pageSize = 6

  // 🔹 Charger les likes
  const fetchLikes = async () => {
    try {
      const res = await fetch('/api/user/likes')
      const data = await res.json()
      if (res.ok) {
        setLikedProducts(data.likedProducts || [])
      }
    } catch (err) {
      console.error('Erreur récupération likes', err)
    }
  }

  // 🔹 Charger les produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/products/category/${category}?limit=${pageSize}&page=${page}`)
        if (!res.ok) throw new Error('Erreur lors du chargement des produits.')
        const data = await res.json()
        setProducts(data.products || [])
        setTotalPages(data.totalPages || 1)
        await fetchLikes()
      } catch (err) {
        toast.error(err.message || 'Une erreur est survenue.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category, page])

  // 🔹 Fonction pour liker/déliker
  const toggleLike = async (itemId) => {
    try {
      const res = await fetch('/api/user/like', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
      })
      const data = await res.json()
      toast.success(data.message)

      // Met à jour localement
      if (likedProducts.includes(itemId)) {
        setLikedProducts(likedProducts.filter(id => id !== itemId))
      } else {
        setLikedProducts([...likedProducts, itemId])
      }
    } catch (err) {
      toast.error("Erreur lors du like")
    }
  }

  if (!loading && products.length === 0) {
    return (
      <main className="min-h-[calc(100vh-70px)] sm:min-h-[calc(100vh-120px)] py-12 flex flex-col items-center justify-center text-center px-4">
        <img
          src="/empty.png"
          alt="Aucun produit"
          className="w-32 sm:w-40 md:w-48 mb-6 opacity-70"
        />
        <h2 className="text-2xl md:text-3xl font-light text-gray-700 mb-3">
          Aucun produit trouvé pour "{category}"
        </h2>
        <p className="text-gray-500 text-base md:text-lg max-w-md">
          Nous n’avons pas encore de produits dans cette catégorie.
          Essayez une autre catégorie ou revenez plus tard.
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-70px)] sm:min-h-[calc(100vh-120px)] p-8">
      {/* ✅ Titre */}
      <h2 className="text-center text-4xl md:text-5xl font-light tracking-wide mb-4 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent">
        Nos Produits {category}
      </h2>
      <p className="text-center text-gray-500 max-w-3xl mx-auto mb-12 text-lg md:text-xl leading-relaxed font-light">
        Explorez notre sélection exclusive pour la catégorie {category}.
      </p>

      {/* ✅ Liste des produits */}
      <div className="flex justify-center flex-wrap gap-3 md:gap-4 lg:gap-5 min-h-[250px]">
        {loading
          ? [...Array(pageSize)].map((_, idx) => (
              <div
                key={idx}
                className="rounded bg-gray-100 shadow animate-pulse w-28 sm:w-30 md:w-34 lg:w-38 xl:w-42 aspect-[4/4.5]"
              ></div>
            ))
          : products.map((product) => {
              const isLiked = likedProducts.includes(product._id)
              return (
                <div
                  key={product._id}
                  className="group block w-28 h-full sm:w-30 md:w-34 lg:w-38 xl:w-42 bg-white rounded overflow-hidden shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative"
                >
                  {/* ❤️ Bouton like */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleLike(product._id)
                    }}
                    className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition"
                  >
                    {isLiked ? (
                      <HeartSolid className="cursor-pointer w-5 h-5 text-red-500" />
                    ) : (
                      <HeartOutline className="cursor-pointer w-5 h-5 text-gray-500 hover:text-red-500" />
                    )}
                  </button>

                  <Link href={`/produits/${product.slug}`}>
                    <div className="relative aspect-[4/4.5] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-1 md:p-2 text-center">
                      <h3 className="text-gray-800 font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-700 mt-0.5 text-[10px] sm:text-xs md:text-sm font-medium">
                        {product.price} DA
                      </p>
                    </div>
                  </Link>
                </div>
              )
            })}
      </div>

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-3">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0 || loading}
            className="p-2 md:p-3 rounded-full bg-white border border-gray-400 hover:bg-gray-100 transition disabled:opacity-30 shadow flex items-center justify-center"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <span className="text-gray-700 font-medium text-sm md:text-base">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={page >= totalPages - 1 || loading}
            className="p-2 md:p-3 rounded-full bg-white border border-gray-400 hover:bg-gray-100 transition disabled:opacity-30 shadow flex items-center justify-center"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        </div>
      )}
    </main>
  )
}
