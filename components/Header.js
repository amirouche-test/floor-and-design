'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, User, Heart, MessageCircle } from 'lucide-react'
import { FiLogOut } from 'react-icons/fi'

export default function Header({ role = 'guest' }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isHome = pathname === '/'
  const isTransparent = isHome && !scrolled

  useEffect(() => {
    if (!isHome) return

    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.ok) window.location.href = '/'
    } catch (error) {
      console.error('Erreur serveur lors de la déconnexion', error)
    }
  }

  const categories = [
    'INTEMPOREL', 'GRAPHIQUES', 'PRESTIGE',
    'ETHINIQUE', 'BAGUETTES', 'INSPIRATION'
  ]

  const navLinkClass = (href) => {
    const isActive = pathname === href
    const baseColor = isTransparent ? 'text-white' : 'text-gray-800'
    const hoverColor = isTransparent ? 'hover:text-gray-300' : 'hover:text-[#5e8a75]'
    const afterColor = isTransparent ? 'after:bg-white' : 'after:bg-[#5e8a75]'

    return `
      relative inline-block px-2 py-1 text-sm font-medium tracking-wide uppercase
      transition-all duration-500 ease-in-out
      ${isActive ? 'text-[#5e8a75]' : `${baseColor} ${hoverColor}`}
      after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px]
      after:transition-all after:duration-500 ease-in-out
      ${isActive ? `after:w-full after:bg-[#5e8a75]` : `after:w-0 ${afterColor} hover:after:w-full`}
    `
  }

  const headerClass = `
    fixed top-0 left-0 w-full z-50 font-sans transition-all duration-500 ease-in-out
    ${isTransparent ? 'bg-transparent text-white' : 'bg-white text-gray-800 shadow-sm backdrop-blur-sm'}
  `

  return (
    <>
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between relative">

        {/* GAUCHE */}
        <div className="hidden sm:flex gap-4 text-sm sm:text-base font-medium items-center">
          <Link href="/la-marque" className={navLinkClass('/la-marque')}>La Marque</Link>
          <Link href="/simulateur-3d" className={navLinkClass('/simulateur-3d')}>Simulateur 3D</Link>
        </div>

        {/* LOGO */}
        <div className="sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
          <Link href="/">
            <img
              src={isTransparent ? '/logo.svg' : '/logo-2.svg'}
              alt="Logo"
              className="w-20 sm:w-24 h-auto object-contain transition-all duration-300"
            />
          </Link>
        </div>

        {/* DROITE */}
        <div className="flex items-center gap-4">
          {/* Burger Mobile */}
          <div className="sm:hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            {isTransparent
              ? (isOpen ? <X size={26} className="text-white" /> : <Menu size={26} className="text-white" />)
              : (isOpen ? <X size={26} className="text-gray-800" /> : <Menu size={26} className="text-gray-800" />)
            }
          </div>

          {/* Auth Desktop */}
          <div className="hidden sm:flex gap-4 text-sm sm:text-base font-medium items-center">
            {role === 'guest' && (
              <>
                <Link href="/inscription" className={navLinkClass('/inscription')}>S'inscrire</Link>
                <Link href="/connexion" className={navLinkClass('/connexion')}>Se connecter</Link>
              </>
            )}
            {role === 'user' && (
              <>
                <Link href="/mon-espace/profil" className={navLinkClass('/mon-espace/profil')}>
                  <User className="inline-block mr-1" size={18} /> 
                </Link>
                <Link href="/mon-espace/favoris" className={navLinkClass('/mon-espace/favoris')}>
                  <Heart className="inline-block mr-1" size={18} /> 
                </Link>
                <Link href="/mon-espace/contact" className={navLinkClass('/mon-espace/contact')}>
                  <MessageCircle className="inline-block mr-1" size={18} /> 
                </Link>
                <button onClick={handleLogout} className="text-red-500 cursor-pointer group hover:text-red-600">
                  <FiLogOut
                    size={18}
                    className="transition-transform duration-200 group-hover:-rotate-90"
                  />
                </button>
              </>
            )}
            {role === 'admin' && (
              <>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    window.location.href = '/admin'
                  }}
                  className="hover:text-[#5e8a75] text-left cursor-pointer"
                >
                  Admin
                </button>

                <button onClick={handleLogout} className="text-red-500 cursor-pointer group hover:text-red-600">
                  <FiLogOut
                    size={18}
                    className="transition-transform duration-200 group-hover:-rotate-90"
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CATEGORIES DESKTOP */}
      <nav className={`hidden sm:block py-2 transition-all duration-500 ease-in-out ${isTransparent ? 'bg-transparent' : 'bg-white shadow-sm backdrop-blur-sm'}`}>
        <ul className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm md:text-base font-semibold tracking-wide">
          {categories.map((name) => {
            const href = `/categorie/${name.toLowerCase()}`
            return (
              <li key={name}>
                <Link href={href} className={navLinkClass(href)}>{name}</Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* MENU MOBILE OUVERT */}
      {isOpen && (
  <div className="sm:hidden absolute top-full left-0 w-full bg-white text-gray-800 shadow-md z-40">
    <div className="py-4 px-4 text-sm font-medium space-y-3">

      {/* Catégories en 2 colonnes */}
      <div className="grid grid-cols-2 gap-2 border-b border-gray-200 pb-3">
        {categories.map((name) => {
          const href = `/categorie/${name.toLowerCase()}`
          return (
            <Link
              key={name}
              href={href}
              onClick={() => setIsOpen(false)}
              className="hover:text-[#5e8a75] whitespace-nowrap"
            >
              {name}
            </Link>
          )
        })}
      </div>

      {/* Autres liens */}
      <div className="flex flex-col gap-2">
        <Link href="/la-marque" onClick={() => setIsOpen(false)} className="hover:text-[#5e8a75]">La Marque</Link>
        <Link href="/simulateur-3d" onClick={() => setIsOpen(false)} className="hover:text-[#5e8a75]">Simulateur 3D</Link>

        {role === 'guest' && (
          <>
            <Link href="/inscription" onClick={() => setIsOpen(false)} className="hover:text-[#5e8a75]">S'inscrire</Link>
            <Link href="/connexion" onClick={() => setIsOpen(false)} className="hover:text-[#5e8a75]">Se connecter</Link>
          </>
        )}

        {role === 'user' && (
          <div className="flex flex-wrap gap-4">
            <Link href="/mon-espace/profil" onClick={() => setIsOpen(false)} className="flex items-center gap-1 hover:text-[#5e8a75]">
              <User size={18} /> Profil
            </Link>
            <Link href="/mon-espace/favoris" onClick={() => setIsOpen(false)} className="flex items-center gap-1 hover:text-[#5e8a75]">
              <Heart size={18} /> Favoris
            </Link>
            <Link href="/mon-espace/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-1 hover:text-[#5e8a75]">
              <MessageCircle size={18} /> Contact
            </Link>
            <button onClick={handleLogout} className="flex cursor-pointer items-center gap-1 text-red-500 group hover:text-red-600">
              <FiLogOut size={18} className="transition-transform duration-200 group-hover:-rotate-90" />
              Déconnexion
            </button>
          </div>
        )}

        {role === 'admin' && (
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                setIsOpen(false)
                window.location.href = '/admin'
              }}
              className="hover:text-[#5e8a75] text-left cursor-pointer"
            >
              Admin
            </button>

            <button onClick={handleLogout} className="flex cursor-pointer items-center gap-1 text-red-500 group hover:text-red-600">
              <FiLogOut size={18} className="transition-transform duration-200 group-hover:-rotate-90" />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}

    </header>
    {!isHome && <div className="h-[70px] sm:h-[120px]" />}
  </>
  )
}
