'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Erreur inconnue')
      } else {
        toast.success('Inscription réussie ! Redirection...')
        setTimeout(() => router.push('/connexion'), 1500)
      }
    } catch (err) {
      console.error(err)
      toast.error('Erreur serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-70px)] sm:min-h-[calc(100vh-120px)]  flex items-center justify-center bg-gradient-to-br from-white via-[#f9f9f9] to-[#f3f3f3] px-4">
      <div className="
        w-full max-w-md p-6 sm:p-8 bg-white/90 backdrop-blur-md rounded-2xl 
        border border-gray-200 shadow-xl space-y-6
      ">
        <h1 className="text-2xl font-semibold text-center text-gray-800 tracking-wide">
          Créez votre compte
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <User size={16} className="text-[#a58d5f]" />
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Jean Carrelage"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                         bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a58d5f] transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Mail size={16} className="text-[#a58d5f]" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="client@design.fr"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                         bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a58d5f] transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Lock size={16} className="text-[#a58d5f]" />
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                         bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a58d5f] transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-[#a58d5f] text-white font-semibold 
                       hover:bg-[#8e744b] transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        {loading && (
          <div className="h-1 bg-[#a58d5f]/30 rounded overflow-hidden">
            <div className="h-1 bg-[#a58d5f] animate-pulse w-2/5"></div>
          </div>
        )}
      </div>
    </div>
  )
}
