'use client'

import EditProductModal from '@/components/EditProductModal'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { PencilIcon, TrashIcon, ArchiveBoxIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { toast } from 'react-hot-toast'

const categoryColors = {
  Textile: 'bg-blue-100 text-blue-700',
  Décoration: 'bg-green-100 text-green-700',
  Accessoire: 'bg-yellow-100 text-yellow-700',
}

export default function ProduitsPage() {
  const [produits, setProduits] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [openedMotif, setOpenedMotif] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProductId, setDeletingProductId] = useState(null)
  const [deleteProgress, setDeleteProgress] = useState(0)
  const [confirmDeleteProduct, setConfirmDeleteProduct] = useState(null)

  const limit = 4

  useEffect(() => {
    async function fetchProduits() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/products?page=${page}&limit=${limit}`)
        if (!res.ok) throw new Error('Erreur de récupération')
        const data = await res.json()
        const sorted = [...data.products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setProduits(sorted)
        setTotalPages(data.totalPages)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduits()
  }, [page])

  const confirmDelete = (product) => {
    setConfirmDeleteProduct(product)
  }

  const handleDeleteProduct = async () => {
    const product = confirmDeleteProduct
    if (!product) return
  
    // ✅ Ferme immédiatement la modale
    setConfirmDeleteProduct(null)
  
    setDeletingProductId(product._id)
    setDeleteProgress(5)
  
    try {
      const interval = setInterval(() => {
        setDeleteProgress((prev) => (prev < 90 ? prev + 10 : prev))
      }, 150)
  
      const res = await fetch(`/api/products/${product._id}`, { method: 'DELETE' })
  
      clearInterval(interval)
      setDeleteProgress(100)
  
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.message || 'Suppression échouée')
      } else {
        setProduits((prev) => prev.filter((p) => p._id !== product._id))
        toast.success('Produit supprimé avec succès')
      }
    } catch (err) {
      console.error(err)
      toast.error('Erreur serveur')
    } finally {
      setDeletingProductId(null)
      setDeleteProgress(0)
    }
  }
  

  return (
    <main className="relative flex flex-col min-h-[calc(100vh-105px)] sm:min-h-[calc(100vh-115px)] p-5  mx-auto bg-white text-gray-800">
      <div className="flex items-center justify-center gap-2 mb-6">
        <ArchiveBoxIcon className="w-6 h-6 text-blue-700" />
        <h1 className="text-2xl sm:text-3xl font-semibold text-blue-700">Tous les produits</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 p-4 rounded space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-300 rounded w-20 h-20" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="flex space-x-2">
                <div className="h-5 bg-gray-300 rounded w-10"></div>
                <div className="h-5 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : produits.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {produits.map((p) => (
            <div key={p._id} className="bg-gray-50 p-4 rounded border border-blue-100 shadow-sm space-y-3 relative">
              <div className="flex items-start gap-4">
                <Link href={`/admin/produits/${p.slug}`}>
                  <img src={p.image} alt={p.name} className="w-20 h-20 cursor-pointer object-cover rounded border border-blue-100" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-semibold truncate">{p.name}</h2>
                    <span className="text-xs text-gray-400 italic">{dayjs(p.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                    <span className="text-xs text-gray-400 italic">| Maj {dayjs(p.updatedAt).format('DD/MM/YYYY HH:mm')}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {p.description.length > 80 ? p.description.slice(0, 80) + '…' : p.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2 items-center">
                    <span className="text-xs font-medium text-gray-800">{p.price ? `💰 ${p.price} DA` : 'Prix non défini'}</span>
                    {p.category.map((cat) => (
                      <span key={cat} className={`text-[11px] px-2 py-0.5 rounded-full ml-2 ${categoryColors[cat] || 'bg-gray-100 text-gray-700'}`}>
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3 relative">
                    {p.motifs.map((motif, idx) => {
                      const isOpen = openedMotif?.produitId === p._id && openedMotif.motifIndex === idx
                      return (
                        <div key={idx} className="relative">
                          <button
                            onClick={() => isOpen ? setOpenedMotif(null) : setOpenedMotif({ produitId: p._id, motifIndex: idx })}
                            className={`text-xs px-2.5 py-0.5 rounded transition cursor-pointer
                              ${isOpen ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                            {motif.nom}
                          </button>
                          {isOpen && (
                            <div className="absolute z-20 left-0 mt-1 w-[260px] bg-white border border-gray-200 rounded-xl shadow-lg p-2 max-h-[200px] overflow-y-auto">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-semibold text-gray-800">{motif.nom}</span>
                                <button onClick={() => setOpenedMotif(null)} className="cursor-pointer p-0.5 text-gray-400 hover:text-red-500">
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </div>
                              {motif.calques.map((c, i) => (
                                <div key={i} className="flex items-center gap-2 hover:bg-gray-50 rounded p-1">
                                  <img src={c.image} alt={c.couleur} className="w-9 h-9 object-cover rounded border" />
                                  <span className="text-xs text-gray-800 truncate min-w-[90px]">{c.couleur}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 text-xs text-gray-500">
                  <Link href={`/admin/produits/${p.slug}`}>
                    <button className="p-2 cursor-pointer bg-yellow-100 rounded hover:bg-yellow-200" title="Voir">👁️</button>
                  </Link>
                  <button onClick={() => setEditingProduct(p)} className="p-2 cursor-pointer bg-blue-100 rounded hover:bg-blue-200" title="Éditer">
                    <PencilIcon className="w-4.5 h-4.5 text-blue-600" />
                  </button>
                  <button onClick={() => confirmDelete(p)} className="p-2 cursor-pointer bg-red-100 rounded hover:bg-red-200" title="Supprimer">
                    <TrashIcon className="w-4.5 h-4.5 text-red-600" />
                  </button>
                </div>
              </div>
              {deletingProductId === p._id && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-600 h-full transition-all duration-200" style={{ width: `${deleteProgress}%` }} />
                  </div>
                  <div className="text-xs text-red-600 text-center mt-1">Suppression... {deleteProgress}%</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ✅ Pop-up de confirmation */}
      {confirmDeleteProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirmation de suppression</h2>
            <p className="text-sm text-gray-600 mb-6">
              Supprimer <strong>{confirmDeleteProduct.name}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteProduct(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteProduct}
                className="cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Pagination */}
      <div className="mt-auto sticky bottom-4 flex justify-center items-center gap-4 z-10">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
          className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 disabled:opacity-40">
          <ChevronLeftIcon className="w-6 h-6 text-blue-700" />
        </button>
        <span className="text-base font-semibold text-gray-700">Page {page} / {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
          className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 disabled:opacity-40">
          <ChevronRightIcon className="w-6 h-6 text-blue-700" />
        </button>
      </div>

      {/* ✅ Modal édition */}
      {editingProduct && (
  <EditProductModal
    product={editingProduct}
    onClose={() => setEditingProduct(null)}
    onSave={async (updatedProduct) => {
      try {
        const res = await fetch(`/api/products/${updatedProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        })
        if (!res.ok) throw new Error('Erreur lors de la mise à jour')
        setProduits((prev) => prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)))
        toast.success('Produit mis à jour avec succès')
        setEditingProduct(null)
      } catch (err) {
        console.error(err)
        toast.error('Erreur lors de la mise à jour')
      }
    }}
  />
)}

    </main>
  )
}
