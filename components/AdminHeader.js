'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiLogOut, FiUser, FiMessageCircle, FiMenu, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function AdminHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        toast.success('Déconnecté avec succès')
        window.location.href = '/'
      } else {
        toast.error('Échec de la déconnexion')
        console.error(await res.text())
      }
    } catch (error) {
      toast.error('Erreur de déconnexion')
      console.error(error)
    }
  }

  const navLink = (href, label) => {
    const isActive = pathname === href
    return (
      <Link href={href}>
        <span
          className={`relative px-3 py-1 text-[17px] font-semibold transition 
            ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
        >
          {label}
          <span
            className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] bg-blue-600 rounded-full transition-all
              ${isActive ? 'w-6 opacity-100' : 'w-0 opacity-0'}
            `}
          />
        </span>
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/admin">
          <span className="text-2xl font-bold text-gray-900 flex items-center gap-1">
            <span className="font-serif">Floor</span>
            <span className="text-blue-600 font-serif">&</span>
            <span className="font-serif">Design</span>
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation liens - Desktop */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-6">
          {navLink('/admin/produits', 'Produits')}
          {navLink('/admin/ajouter-produit', 'Ajouter Produit')}
          {navLink('/admin/palette-couleurs', 'Palette Couleurs')}
        </nav>

        {/* Actions - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/admin/contacts" title="Messages">
            <span className="text-green-600 hover:text-green-700">
              <FiMessageCircle size={20} />
            </span>
          </Link>
          <Link href="/admin/profil" title="Profil">
            <span className="text-blue-600 hover:text-blue-700">
              <FiUser size={20} />
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="cursor-pointer group flex items-center gap-2 px-4 py-2 rounded-md border border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 transition duration-200"
          >
            <FiLogOut
              size={18}
              className="transition-transform duration-200 group-hover:-rotate-90"
            />
            <span className="font-medium">Se déconnecter</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pt-3 pb-4 space-y-3 bg-white border-t border-gray-200 shadow-sm">
          <div className="flex flex-col gap-2">
            {navLink('/admin/produits', 'Produits')}
            {navLink('/admin/ajouter-produit', 'Ajouter Produit')}
            {navLink('/admin/palette-couleurs', 'Palette Couleurs')}
          </div>
          <div className="flex items-center gap-4 pt-4">
            <Link href="/admin/contacts" title="Messages">
              <span className="text-green-600 hover:text-green-700">
                <FiMessageCircle size={20} />
              </span>
            </Link>
            <Link href="/admin/profil" title="Profil">
              <span className="text-blue-600 hover:text-blue-700">
                <FiUser size={20} />
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center gap-2 px-3 py-1 border border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md text-sm"
            >
              <FiLogOut size={16} className="group-hover:-rotate-90 transition-transform" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
