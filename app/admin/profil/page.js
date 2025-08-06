'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Loader2, User, Mail, Phone, MapPin, ImageIcon } from 'lucide-react'

export default function UpdateProfileForm() {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', image: '' })
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me')
        const data = await res.json()
        setUser(data.user)
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          image: data.user.image || '',
        })
      } catch (err) {
        toast.error("Erreur de chargement du profil")
      } finally {
        setLoadingProfile(false)
      }
    }
    fetchUser()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) setSelectedImage(file)
  }

  const uploadImageToCloudinary = async () => {
    await fetch('/api/cloudinary/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId: `users/${user._id}` }),
    })

    const form = new FormData()
    form.append('file', selectedImage)
    form.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
    form.append('folder', 'users')
    form.append('public_id', user._id)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
      method: 'POST',
      body: form,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message || 'Erreur Cloudinary')
    return data.secure_url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Nom et email sont obligatoires')
      return
    }

    setLoading(true)
    try {
      let imageUrl = formData.image
      if (selectedImage) {
        imageUrl = await uploadImageToCloudinary()

        // ✅ Attendre un petit délai pour que Cloudinary propage l'image
        // await new Promise((resolve) => setTimeout(resolve, 1000)) // 1 seconde
      } 
        

      const updatedUser = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        image: imageUrl,
      }

      const res = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Erreur de mise à jour')

      toast.success('Profil mis à jour')
      setUser(data.user)
      setFormData(data.user)
      setSelectedImage(null)
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  if (loadingProfile) {
    return (
      <div className="max-w-md mx-auto p-4 bg-white shadow rounded space-y-4 animate-pulse">
        <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto" />
        <div className="h-10 mt-7 bg-gray-300 rounded w-3/4 mx-auto" />
        <div className="h-10 mt-7 bg-gray-300 rounded w-full" />
        <div className="h-10 mt-7 bg-gray-300 rounded w-full" />
        <div className="h-10 mt-7 bg-gray-300 rounded w-full" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow space-y-4">
      {/* Image de profil */}
      <div className="relative w-24 h-24 mx-auto">
        <Image
          src={selectedImage ? URL.createObjectURL(selectedImage) : user.image || '/user.png'}
          alt="Profile"
          fill
          className="rounded-full object-cover border-2 border-blue-500"
        />
        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
          <ImageIcon size={16} />
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
      </div>

      {/* Champs */}
      {[
        { icon: <User size={18} />, name: 'name', type: 'text', placeholder: 'Nom complet' },
        { icon: <Mail size={18} />, name: 'email', type: 'email', placeholder: 'Email' },
        { icon: <Phone size={18} />, name: 'phone', type: 'text', placeholder: 'Téléphone' },
        { icon: <MapPin size={18} />, name: 'address', type: 'text', placeholder: 'Adresse' },
      ].map(({ icon, name, type, placeholder }) => (
        <div className="relative" key={name}>
          <div className="absolute top-2 left-2 text-blue-500">{icon}</div>
          <input
            name={name}
            type={type}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition"
          />
        </div>
      ))}

      {/* Bouton */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex cursor-pointer items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading && <Loader2 className="animate-spin" size={18} />}
        {loading ? 'Mise à jour...' : 'Mettre à jour'}
      </button>
    </form>
  )
}
