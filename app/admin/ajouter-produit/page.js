'use client'

import { useState } from 'react'
import DossierPreview from '@/components/DossierPreview'
import { PlusIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

const CATEGORIES = [
  'INTEMPOREL',
  'GRAPHIQUES',
  'PRESTIGE',
  'ETHINIQUE',
  'BAGUETTES',
  'INSPIRATION',
]

const uploadToCloudinary = async (file, publicId, folder) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', folder)
  formData.append('public_id', publicId)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Erreur Cloudinary')
  return data.secure_url
}

export default function AjouterProduitPage() {
  const [structure, setStructure] = useState(null)
  const [description, setDescription] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFilesSelection = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const result = { productName: '', imagePrincipale: null, motifs: {} }

    files.forEach((file) => {
      const parts = file.webkitRelativePath.split('/')
      if (!result.productName) result.productName = parts[0]

      if (parts.length === 2) {
        result.imagePrincipale = file
      } else if (parts.length === 3) {
        const motif = parts[1]
        const calqueNom = parts[2].replace(/\.[^/.]+$/, '')
        if (!result.motifs[motif]) result.motifs[motif] = []
        result.motifs[motif].push({ couleur: calqueNom, file })
      }
    })

    setStructure(result)
  }

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleUploadAndSave = async () => {
    if (!structure || !description || selectedCategories.length === 0 || !price) {
      toast.error('Veuillez remplir tous les champs requis.')
      return
    }

    try {
      const checkRes = await fetch('/api/products/exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: structure.productName }),
      })

      const checkData = await checkRes.json()
      if (checkData.exists) {
        toast.error('Un produit avec ce nom existe déjà.')
        return
      }
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la vérification du produit.')
      return
    }

    setLoading(true)
    setProgress(0)

    try {
      const baseFolder = `produits/${structure.productName}`
      const totalFiles = 1 + Object.values(structure.motifs).reduce((sum, motif) => sum + motif.length, 0)
      let uploaded = 0

      const imageUrl = await uploadToCloudinary(structure.imagePrincipale, 'imagePrincipale', baseFolder)
      uploaded += 1
      setProgress(Math.round((uploaded / totalFiles) * 100))

      const motifs = {}
      for (const motifNom of Object.keys(structure.motifs)) {
        motifs[motifNom] = []

        for (const calque of structure.motifs[motifNom]) {
          const url = await uploadToCloudinary(calque.file, calque.couleur, `${baseFolder}/${motifNom}`)
          motifs[motifNom].push({ couleur: calque.couleur, image: url })

          uploaded += 1
          setProgress(Math.round((uploaded / totalFiles) * 100))
        }
      }

      const newProduct = {
        name: structure.productName,
        image: imageUrl,
        description,
        category: selectedCategories,
        price: parseFloat(price),
        motifs: Object.entries(motifs).map(([nom, calques]) => ({ nom, calques })),
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(`Erreur API: ${err.error}`)
      } else {
        toast.success('Produit enregistré avec succès 🎉')
        setStructure(null)
        setDescription('')
        setSelectedCategories([])
        setPrice('')
        setProgress(0)
      }
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de l'upload")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-800">
      {/* Formulaire */}
      <div className="md:col-span-2 space-y-4 bg-white rounded shadow p-6">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 mb-3">
          <PlusIcon className="w-6 h-6 text-blue-700" />
          <h1 className="text-2xl font-semibold text-blue-700">Ajouter un produit</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">📁 Dossier du produit</label>
            <input
              type="file"
              webkitdirectory="true"
              directory=""
              multiple
              onChange={handleFilesSelection}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">📝 Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">🏷️ Catégories</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-blue-600"
                  />
                  <span className="text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">💰 Prix</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 49.99"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          disabled={!structure || loading}
          onClick={handleUploadAndSave}
          className="mt-4 cursor-pointer inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <CloudArrowUpIcon className="w-5 h-5" />
          {loading ? `⏳ Upload ${progress}%` : 'Uploader & Enregistrer'}
        </button>
      </div>

      {/* Aperçu */}
      <div className="md:col-span-1">
        <DossierPreview structure={structure} />
      </div>

      {/* ✅ Progress bar moderne */}
      {loading && (
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-200">
          <div
            className="bg-blue-600 h-1 transition-all duration-300 rounded-r"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
