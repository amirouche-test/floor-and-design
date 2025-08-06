'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

const CATEGORIES = [
  'INTEMPOREL',
  'GRAPHIQUES',
  'PRESTIGE',
  'ETHINIQUE',
  'BAGUETTES',
  'INSPIRATION',
]

export default function EditProductModal({ product, onClose, onSave }) {
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(product.price || '')
  const [selectedCategories, setSelectedCategories] = useState(product.category || [])
  const [loading, setLoading] = useState(false)

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          price: Number(price),
          category: selectedCategories,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(`Erreur: ${data.message}`)
      } else {
        const data = await res.json()
        onSave(data.updatedProduct) // mettre à jour la liste des produits dans la page parent
        onClose()
      }
    } catch (err) {
      console.error(err)
      alert('Erreur serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative animate-fadeIn">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold text-blue-700 mb-4">Modifier le produit</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">📝 Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">💰 Prix</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">🏷️ Catégories</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-blue-600"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="cursor-pointer mt-5 w-full bg-blue-600 text-white py-2.5 rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? '⏳ Sauvegarde...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  )
}
