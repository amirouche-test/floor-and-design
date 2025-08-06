'use client'

import { useState, useEffect } from 'react'
import { SwatchIcon, PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function PaletteCouleursPage() {
  const [couleurs, setCouleurs] = useState([])
  const [newNom, setNewNom] = useState('')
  const [newHex, setNewHex] = useState('')
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedCouleur, setSelectedCouleur] = useState(null)
  const [editNom, setEditNom] = useState('')
  const [editHex, setEditHex] = useState('')

  const fetchCouleurs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/palette-couleurs')
      if (!res.ok) throw new Error('Impossible de charger les couleurs.')
      const data = await res.json()
      setCouleurs(data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCouleurs()
  }, [])

  const addCouleur = async () => {
    if (!newNom.trim() || !/^#([0-9A-F]{3}){1,2}$/i.test(newHex)) {
      toast.error('Nom ou code hex invalide.')
      return
    }
    if (couleurs.some(c => c.nom.toLowerCase() === newNom.trim().toLowerCase())) {
      toast.error('Cette couleur existe déjà.')
      return
    }
    setAdding(true)
    setProgress(20)
    try {
      const res = await fetch('/api/palette-couleurs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: newNom.trim(), hex: newHex })
      })
      setProgress(80)
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.message || 'Erreur lors de l\'ajout.')
      } else {
        await fetchCouleurs()
        setNewNom('')
        setNewHex('')
        toast.success('Couleur ajoutée')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setAdding(false)
      setProgress(100)
      setTimeout(() => setProgress(0), 600)
    }
  }

  const updateCouleur = async () => {
    if (!editNom.trim() || !/^#([0-9A-F]{3}){1,2}$/i.test(editHex)) {
      toast.error('Nom ou code hex invalide.')
      return
    }
    if (
      editNom.trim().toLowerCase() !== selectedCouleur.nom.toLowerCase() &&
      couleurs.some(c => c.nom.toLowerCase() === editNom.trim().toLowerCase())
    ) {
      toast.error('Un autre couleur porte déjà ce nom.')
      return
    }
    try {
      const res = await fetch(`/api/palette-couleurs/${encodeURIComponent(selectedCouleur._id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: editNom.trim(), hex: editHex })
      })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.message || 'Erreur lors de la modification.')
      } else {
        await fetchCouleurs()
        toast.success('Couleur modifiée')
        setSelectedCouleur(null)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const deleteCouleur = async () => {
    try {
      const res = await fetch(`/api/palette-couleurs/${encodeURIComponent(selectedCouleur._id)}`, {
        method: 'DELETE'
      })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.message || 'Erreur lors de la suppression.')
      } else {
        await fetchCouleurs()
        toast.success('Couleur supprimée')
        setSelectedCouleur(null)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <main className="relative mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800">

      {/* Formulaire */}
      <div className="md:col-span-1 bg-white rounded shadow p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <PlusIcon className="w-6 h-6 text-green-700" />
          <h1 className="text-2xl font-semibold text-green-700">Ajouter une couleur</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">🎨 Nom</label>
            <input
              value={newNom}
              onChange={(e) => setNewNom(e.target.value)}
              placeholder="Ex: Bleu Ciel"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">#️⃣ Code Hex</label>
            <div className="flex items-center gap-2">
              <input
                value={newHex}
                onChange={(e) => setNewHex(e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl shadow-sm 
                           focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              <div className="w-10 h-10 rounded-full border border-gray-300 shadow" style={{ backgroundColor: newHex }} />
            </div>
          </div>
        </div>

        <button
          onClick={addCouleur}
          disabled={adding}
          className="mt-3 flex cursor-pointer items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-green-700 disabled:opacity-50 transition"
        >
          <PlusIcon className="w-5 h-5" />
          {adding ? 'Ajout . . . . . . . . . . . . . .' : 'Ajouter & Enregistrer'}
        </button>
      </div>

      {/* Palette */}
      <div className="md:col-span-2 bg-white rounded shadow p-6">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <SwatchIcon className="w-6 h-6 text-blue-700" />
          <h2 className="text-2xl font-semibold text-blue-700">Palette de couleurs</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-20 gap-2 mt-4">
            {Array.from({ length: 20 }).map((_, idx) => (
              <div key={idx} className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-14 sm:grid-cols-16 md:grid-cols-20 gap-2 max-h-[300px] overflow-y-auto p-1 mt-2">
            {couleurs.map((c, idx) => (
              <div
                key={idx}
                onClick={() => { setSelectedCouleur(c); setEditNom(c.nom); setEditHex(c.hex) }}
                className="w-6 h-6 rounded-full border-gray-200 shadow cursor-pointer hover:scale-110 transition"
                style={{ backgroundColor: c.hex }}
                title={c.nom}
              />
            ))}
          </div>
        )}
      </div>

      {/* Progress bar fine et fluide */}
      {adding && (
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-200">
          <div className="bg-green-600 h-1 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Modale édition */}
      {selectedCouleur && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <button
              onClick={() => setSelectedCouleur(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition cursor-pointer"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h2 className="text-xl font-semibold text-blue-700">Modifier la couleur</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">🎨 Nom</label>
                <input
                  value={editNom}
                  onChange={(e) => setEditNom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">#️⃣ Code Hex</label>
                <div className="flex items-center gap-2">
                  <input
                    value={editHex}
                    onChange={(e) => setEditHex(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl shadow-sm 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <div className="w-10 h-10 rounded-full border border-gray-300 shadow" style={{ backgroundColor: editHex }} />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={updateCouleur}
                className="flex-1 bg-blue-600 text-white py-2.5 cursor-pointer rounded-xl shadow hover:bg-blue-700 transition"
              >
                <PencilIcon className="w-5 h-5 inline mr-1" /> Modifier
              </button>
              <button
                onClick={deleteCouleur}
                className="flex-1 bg-red-600 text-white cursor-pointer py-2.5 rounded-xl shadow hover:bg-red-700 transition"
              >
                <TrashIcon className="w-5 h-5 inline mr-1" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
