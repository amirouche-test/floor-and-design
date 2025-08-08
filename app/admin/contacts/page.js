'use client'

import { useEffect, useState } from 'react'
import { Search, ArrowLeft } from 'lucide-react'
import AdminConversation from '@/components/AdminConversation'
import toast from 'react-hot-toast'

export default function AdminContactPage() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [search, setSearch] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/contact/users')
        if (!res.ok) throw new Error('Erreur API')
        const data = await res.json()
  
        setUsers(data)
  
        if (data.length > 0) {
          setSelectedUser(data[0])
        }
      } catch (err) {
        toast.error("Erreur lors du chargement des utilisateurs")
      } finally {
        setLoadingUsers(false)
      }
    }
  
    fetchUsers()
  }, [])
  
  

  const filteredUsers = users
    .filter(user => user.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    if (window.innerWidth < 768) {
      setIsMobileView(true)
    }
  }

  const handleBackToUsers = () => {
    setIsMobileView(false)
    setSelectedUser(null)
  }

  return (
    <main className="flex flex-col sm:flex-row h-[calc(100vh-105px)] bg-gray-50 overflow-hidden">
      {/* LEFT: Users list */}
      <aside className={`w-full sm:w-1/4 h-full bg-white border-r flex flex-col transition-all duration-300 ${isMobileView ? 'hidden' : 'flex'}`}>
        <div className="px-4 py-3 border-b">
          <h2 className="text-base font-semibold mb-3">Utilisateurs</h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3 scrollbar-hide">
          {loadingUsers ? (
            <ul className="space-y-3 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 p-2 rounded bg-gray-100"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300" />
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2">
              {filteredUsers.map(user => (
                <li
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition ${
                    selectedUser?._id === user._id ? 'bg-gray-100' : ''
                  }`}
                >
                  <img
                    src={user.image || '/user.png'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium text-sm truncate">{user.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* RIGHT: Conversation */}
      <section className={`w-full sm:w-3/4 h-full flex flex-col ${isMobileView ? 'flex' : 'hidden sm:flex'} transition-all duration-300`}>
        {isMobileView && (
          <div className="flex items-center gap-2 p-3 border-b bg-white">
            <button className="flex items-center text-sm font-medium" onClick={handleBackToUsers}>
              <ArrowLeft className="w-5 h-5 mr-1" />
              Utilisateurs
            </button>
          </div>
        )}

        <AdminConversation selectedUser={selectedUser} />
      </section>
    </main>
  )
}
