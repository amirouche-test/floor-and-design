'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || 'Erreur inconnue')
      } else {
        toast.success('Connexion réussie')
        const role = data.user?.role || 'user'

        setTimeout(() => {
          if (role === 'admin') {
            window.location.href = '/admin' // ou window.location.reload() si déjà sur /admin
          } else {
            window.location.href = '/'
          }
        }, 1500)
        
      }
    } catch (error) {
      toast.error('Erreur serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-70px)] sm:min-h-[calc(100vh-120px)] flex items-center justify-center bg-gradient-to-br from-white to-[#f3f4f6] px-4">
      <div className="
        w-full max-w-md p-6 sm:p-8 bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl space-y-6
      ">
        <h1 className="text-2xl font-semibold text-center text-gray-800 tracking-wide">
          Connexion
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Mail size={16} className="text-green-600" />
              Adresse e-mail
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="exemple@design.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                         bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Lock size={16} className="text-green-600" />
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                         bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold 
                       hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Connexion...' : "Se connecter"}
          </button>
        </form>

        {loading && (
          <div className="h-1 bg-green-100 rounded overflow-hidden">
            <div className="h-1 bg-green-500 animate-pulse w-1/2"></div>
          </div>
        )}
      </div>
    </div>
  )
}
