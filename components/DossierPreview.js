'use client'

import { useState } from 'react'

export default function DossierPreview({ structure }) {
  if (!structure) {
    return (
      <div className="text-gray-500 italic border border-dashed rounded p-4 bg-gray-50 text-center">
        📁 Importez un dossier pour voir sa structure ici.
      </div>
    )
  }

  const sortedMotifs = Object.entries(structure.motifs).sort(([a], [b]) =>
    a.localeCompare(b)
  )

  return (
    <div className="border border-gray-200 p-4 rounded-xl shadow-sm bg-white text-sm">
      {/* En-tête avec image principale et nom */}
      <div className="flex items-center gap-3 mb-3">
        {structure.imagePrincipale && (
          <img
            src={URL.createObjectURL(structure.imagePrincipale)}
            alt="image principale"
            className="w-14 h-14 object-cover rounded border"
          />
        )}
        <h2 className="font-semibold text-indigo-700 text-base truncate">
          📁 {structure.productName}
        </h2>
      </div>

      {/* Motifs */}
      <div className="space-y-2">
        {sortedMotifs.map(([motifNom, calques]) => (
          <MotifBlock key={motifNom} motifNom={motifNom} calques={calques} />
        ))}
      </div>
    </div>
  )
}

function MotifBlock({ motifNom, calques }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1.5 rounded hover:bg-indigo-100 transition"
      >
        <span className="truncate">📂 {motifNom}</span>
        <span className="text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="ml-2 mt-2 max-h-40 overflow-y-auto pr-1">
          <ul className="space-y-2">
            {calques.map((calque, i) => (
              <li key={i} className="flex items-center gap-2">
                <img
                  src={URL.createObjectURL(calque.file)}
                  alt={calque.couleur}
                  className="w-9 h-9 object-cover border rounded"
                />
                <span className="text-xs text-gray-800 truncate">{calque.couleur}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
